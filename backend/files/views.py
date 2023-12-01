import os
import logging
import urllib

import uuid
from django.contrib.auth.hashers import make_password
from rest_framework import generics, viewsets, permissions, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response

from .models import File, Folder
from .serializers import FileSerializer, UserSerializer, GroupSerializer, FileDetailSerializer, FolderSerializer, \
    FileShareUrlSerializer
from django.contrib.auth.models import User, Group
from django.http import HttpResponse, Http404, FileResponse
from rest_framework.authtoken.models import Token
from django.conf import settings

logging.basicConfig(level=logging.INFO, filename="py_log.log", filemode="a",
                    format="%(asctime)s %(levelname)s %(message)s")


class FileDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileDetailSerializer
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = File.objects.all()

    def get(self, request, *args, **kwargs):
        logging.info(f"Выбран файл: {File.objects.get(id=self.kwargs['pk'])}")
        print(f"Выбран файл: {File.objects.get(id=self.kwargs['pk'])}")
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        old_label_file = File.objects.get(id=self.kwargs['pk'])
        logging.info(f"Имя файла: {old_label_file} обновлено на:")
        print(f"Имя файла: {old_label_file} обновлено на:")
        self.update(request, *args, **kwargs)
        instance = File.objects.get(id=self.kwargs['pk'])
        file_dir = f"{os.getcwd()}\\files\\storages"
        ids = request.user.id
        os.rename(f'{file_dir}\\{ids}\\{old_label_file}', f'{file_dir}\\{ids}\\{instance}')
        instance.file.name = f"files/storages/{ids}/{request.data['label']}"
        instance.save()
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        label_file = File.objects.get(id=self.kwargs['pk'])
        file_dir = os.getcwd() + '/files/storages'
        os.remove(str(file_dir) + '/' + str(label_file))
        print('Удалён файл: ' + str(File.objects.get(id=self.kwargs['pk'])))
        logging.info('Удалён файл: ' + str(File.objects.get(id=self.kwargs['pk'])))
        return self.destroy(request, *args, **kwargs)


class ShareUrlAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = FileShareUrlSerializer
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = File.objects.all()

    def get(self, request, *args, **kwargs):
        print(f"Для создания uuid выбран следующий файл: {File.objects.get(id=self.kwargs['pk'])}")
        logging.info(f"Для создания uuid выбран следующий файл: {File.objects.get(id=self.kwargs['pk'])}")
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        instance = File.objects.get(id=self.kwargs['pk'])
        instance.share = uuid.uuid4()
        logging.info(f"Ссылка создана: {request.build_absolute_uri('/')}file/download/?share={instance.share}")
        print(f"Ссылка создана: {request.build_absolute_uri('/')}file/download/?share={instance.share}")
        instance.url = f"{request.build_absolute_uri('/')}file/download/?share={instance.share}"
        instance.save()
        return self.update(request, *args, **kwargs)


def download_share(request):
    file_uuid = request.GET.get('share')
    obj = File.objects.get(share=file_uuid)
    filename = obj.file.path
    response = FileResponse(open(filename, 'rb'))
    return response


class FilesListFolder(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self, *args, **kwargs):
        req_user_name = User.objects.get(username=self.request.user)
        logging.info(f'Обзор списка файлов пользователем: [{req_user_name}]')
        return self.queryset.filter(user=req_user_name)

    def post(self, request, *args, **kwargs):
        req_user_name = User.objects.get(username=self.request.user)
        instance = User.objects.get(username=req_user_name)
        return self.create(request, *args, **kwargs)


class AuthUser(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        req_user_name = User.objects.get(username=self.request.user)
        if req_user_name:
            logging.info(f'Авторизовался пользователь под ником: {req_user_name}')
            return Response({"auth": True, "userInfo": {"admin": req_user_name.is_superuser,
                                                        "name": req_user_name.username,
                                                        "email": req_user_name.email,
                                                        "lastLogin": req_user_name.last_login}})


class FileNullFolderApiView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(folder=None)


class FileListCreateApiView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(folder=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save()


class FolderApiView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class FolderNullParentApiView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(parent=None)


class FoldersListApiView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('date_joined')
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token = Token.objects.create(user=serializer.instance)
        token_data = {"token": token.key}
        return Response(
            {**serializer.data, **token_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        if 'password' in self.request.data:
            password = make_password(self.request.data['password'])
            serializer.save(password=password)
        else:
            serializer.save()
        logging.info(f'Зарегистрирован новый пользователь: {serializer.data["username"]}')
        print(f'Зарегистрирован новый пользователь: {serializer.data["username"]}')

    def perform_update(self, serializer):
        if 'password' in self.request.data:
            password = make_password(self.request.data['password'])
            serializer.save(password=password)
        else:
            serializer.save()
        logging.info(f'Данные пользователя: {serializer.data["username"]} обновлены')
        print(f'Данные пользователя: {serializer.data["username"]} обновлены')


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class FolderListCreateApiView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def perform_create(self, serializer):
        serializer.save()
