window.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const imagePreview = document.getElementById('image-preview');
  const downloadBtn = document.getElementById('download-btn');
  const copyBtn = document.getElementById('copy-btn');

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ['.jpg', '.png', '.webp', '.jpeg'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (allowedExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = function () {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            // 이미지 변환 (흑백 처리)
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 흑백 처리
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg;
              data[i + 1] = avg;
              data[i + 2] = avg;
            }
            ctx.putImageData(imageData, 0, 0);

            // 미리보기 설정
            imagePreview.src = canvas.toDataURL(file.type);
            imagePreview.style.display = 'block';

            // 다운로드 버튼 기능 추가
            downloadBtn.onclick = () => {
              const link = document.createElement('a');
              link.href = canvas.toDataURL(file.type);
              link.download = 'safe_image' + fileExtension;
              link.click();
            };

            // 클립보드에 복사 버튼 기능 추가
            copyBtn.onclick = () => {
              canvas.toBlob((blob) => {
                const item = new ClipboardItem({ [blob.type]: blob });
                navigator.clipboard.write([item]).then(() => {
                  alert('Image copied to clipboard');
                }).catch((err) => {
                  console.error('Failed to copy: ', err);
                });
              });
            };
          };
        };
        reader.readAsDataURL(file);
      } else {
        alert('Only .jpg, .png, .webp, and .jpeg files are allowed.');
      }
    }
  });
});