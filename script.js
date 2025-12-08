/**
 * 유튜브 썸네일 추출기
 * 유튜브 영상 URL에서 다양한 해상도의 썸네일을 추출합니다.
 */

// DOM 요소 선택
const youtubeUrlInput = document.getElementById('youtube-url');
const extractBtn = document.getElementById('extract-btn');
const resultSection = document.getElementById('result-section');
const errorSection = document.getElementById('error-section');
const errorMessage = document.getElementById('error-message');
const videoIdDisplay = document.getElementById('video-id-display');

// 썸네일 이미지 요소들
const thumbMaxres = document.getElementById('thumb-maxres');
const thumbSd = document.getElementById('thumb-sd');
const thumbHq = document.getElementById('thumb-hq');
const thumbMq = document.getElementById('thumb-mq');
const thumbDefault = document.getElementById('thumb-default');

// 썸네일 URL 패턴
const thumbnailUrls = {
    maxres: (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    sd: (id) => `https://img.youtube.com/vi/${id}/sddefault.jpg`,
    hq: (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    mq: (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    default: (id) => `https://img.youtube.com/vi/${id}/default.jpg`
};

// 현재 비디오 ID 저장
let currentVideoId = '';

/**
 * 유튜브 URL에서 비디오 ID 추출
 * @param {string} url - 유튜브 URL
 * @returns {string|null} - 비디오 ID 또는 null
 */
function extractVideoId(url) {
    if (!url) return null;

    // URL 정리
    url = url.trim();

    // 다양한 유튜브 URL 패턴
    const patterns = [
        // 표준 유튜브 URL (youtube.com/watch?v=)
        /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/,
        // 짧은 URL (youtu.be/)
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        // 임베드 URL (youtube.com/embed/)
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        // 쇼츠 URL (youtube.com/shorts/)
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        // 모바일 URL (m.youtube.com)
        /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        // 라이브 URL
        /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
        // 비디오 ID만 입력한 경우
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

/**
 * 썸네일 표시
 * @param {string} videoId - 유튜브 비디오 ID
 */
function displayThumbnails(videoId) {
    currentVideoId = videoId;
    videoIdDisplay.textContent = videoId;

    // 각 썸네일 이미지 설정
    thumbMaxres.src = thumbnailUrls.maxres(videoId);
    thumbSd.src = thumbnailUrls.sd(videoId);
    thumbHq.src = thumbnailUrls.hq(videoId);
    thumbMq.src = thumbnailUrls.mq(videoId);
    thumbDefault.src = thumbnailUrls.default(videoId);

    // maxres가 없을 경우 hq로 대체
    thumbMaxres.onerror = function () {
        this.src = thumbnailUrls.hq(videoId);
    };

    // sd가 없을 경우 hq로 대체
    thumbSd.onerror = function () {
        this.src = thumbnailUrls.hq(videoId);
    };

    // 결과 섹션 표시
    errorSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 에러 표시
 * @param {string} message - 에러 메시지
 */
function showError(message) {
    errorMessage.textContent = message;
    resultSection.classList.add('hidden');
    errorSection.classList.remove('hidden');

    // 에러 섹션으로 스크롤
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 썸네일 추출 실행
 */
function extractThumbnails() {
    const url = youtubeUrlInput.value;
    const videoId = extractVideoId(url);

    if (videoId) {
        displayThumbnails(videoId);
    } else {
        showError('올바른 유튜브 URL을 입력해주세요. 예: https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    }
}

/**
 * 썸네일 다운로드
 * @param {string} size - 썸네일 크기 (maxres, sd, hq, mq, default)
 */
async function downloadThumbnail(size) {
    if (!currentVideoId) return;

    const url = thumbnailUrls[size](currentVideoId);
    const filename = `youtube_thumbnail_${currentVideoId}_${size}.jpg`;

    try {
        // Fetch를 사용하여 이미지 가져오기
        const response = await fetch(url);
        const blob = await response.blob();

        // Blob URL 생성
        const blobUrl = URL.createObjectURL(blob);

        // 다운로드 링크 생성
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Blob URL 해제
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        // CORS 문제가 있을 경우 새 탭에서 열기
        window.open(url, '_blank');
    }
}

// 이벤트 리스너 설정
extractBtn.addEventListener('click', extractThumbnails);

// Enter 키로 추출
youtubeUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        extractThumbnails();
    }
});

// 다운로드 버튼들에 이벤트 리스너 추가
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        downloadThumbnail(size);
    });
});

// URL 붙여넣기 시 자동 추출 (선택적)
youtubeUrlInput.addEventListener('paste', (e) => {
    // 약간의 지연을 주어 붙여넣기가 완료된 후 추출
    setTimeout(() => {
        const url = youtubeUrlInput.value;
        if (url && extractVideoId(url)) {
            extractThumbnails();
        }
    }, 100);
});

// 페이지 로드 시 입력창에 포커스
window.addEventListener('load', () => {
    youtubeUrlInput.focus();
});
