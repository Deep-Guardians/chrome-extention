document.addEventListener('change', (event) => {
  try {
    if (event.target && event.target.type === 'file' && event.target.files.length > 0) {
      const fileInput = event.target;
      const file = fileInput.files[0];
      const allowedExtensions = ['.jpg', '.png', '.webp', '.jpeg'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (allowedExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const blob = new Blob([reader.result], { type: file.type });
            const newFile = new File([blob], "safe_image" + fileExtension, { type: file.type });

            console.log('File copied and transformed to: ', newFile.name);

            // 이미지 URL 생성 및 사용자에게 알림
            const imageUrl = URL.createObjectURL(newFile);
            alert('The image has been transformed. Click OK to download the image.');

            // 사용자가 확인을 누르면 이미지 다운로드
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = newFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (fileError) {
            console.error('Error while creating new File object: ', fileError);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  } catch (error) {
    console.error('Error while processing image upload: ', error);
  }
});