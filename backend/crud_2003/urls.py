"""
URL configuration for crud_2003 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.authtoken.views import obtain_auth_token

from rest_framework.routers import DefaultRouter

from files.views import UserViewSet, GroupViewSet, FileDetailAPIView, \
    FileNullFolderApiView, FolderApiView, FoldersListApiView, FilesListFolder, ShareUrlAPIView, download_share, \
    AuthUser, RemoveShareUrlAPIView

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('admin/', admin.site.urls),
    path('file/<int:pk>/', FileDetailAPIView.as_view()),
    path('file/<int:pk>/share/', ShareUrlAPIView.as_view()),
    path('file/<int:pk>/remove_share/', RemoveShareUrlAPIView.as_view()),
    path('file/download/', download_share),
    path('folder/list/', FilesListFolder.as_view()),
    path('login/', AuthUser.as_view()),
    path('folder/<int:pk>/', FolderApiView.as_view()),
    path('folders/', FoldersListApiView.as_view()),
    path('root_folder/', FileNullFolderApiView.as_view()),
    # path(r'^auth/login/$',
    #      obtain_auth_token,
    #      name='auth_user_login'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

urlpatterns += static('files/', document_root=os.path.join(settings.BASE_DIR, 'files'))
