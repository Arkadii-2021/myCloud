export default function fileSizeFormat(value) {
	let size = '';
	if (value < 1024) {
		size = `${value} B`
	}
	else if (value < 1048576) {
		size = `${Math.round(value/1024)} KB`
	}	
	else if (value < 1073741824) {
		size = `${Math.round(value/1024/1024)} MB`
	}
	else {size = `${Math.round(value/1024/1024/1024)} GB`}
	
	return size
};
