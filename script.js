/**
 * YouTube Script Wizard
 * AI 기반 유튜브 스크립트 자동화
 */

// DOM 요소
const topicInput = document.getElementById('topic-input');
const generateBtn = document.getElementById('generate-btn');
const quickTags = document.querySelectorAll('.tag');
const steps = document.querySelectorAll('.step');

// 진행 단계 업데이트
function updateProgress(stepIndex) {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index <= stepIndex);
    });
}

// 입력 유효성 검사
function validateInput() {
    const topic = topicInput.value.trim();
    return topic.length > 0;
}

// 생성 버튼 클릭 처리
function handleGenerate() {
    if (!validateInput()) {
        // 입력창 흔들기 효과
        topicInput.parentElement.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            topicInput.parentElement.style.animation = '';
        }, 500);
        topicInput.focus();
        return;
    }

    const topic = topicInput.value.trim();

    // 로딩 상태
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <span class="btn-text">생성 중...</span>
        <div class="btn-icon" style="animation: spin 1s linear infinite;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="30 70"/>
            </svg>
        </div>
    `;

    // 진행 단계 업데이트
    updateProgress(1);

    // 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
        updateProgress(2);

        setTimeout(() => {
            updateProgress(3);
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <span class="btn-text">생성하기</span>
                <div class="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14"/>
                        <path d="M12 5l7 7-7 7"/>
                    </svg>
                </div>
            `;

            // 성공 알림
            showNotification(`"${topic}" 스크립트가 생성되었습니다!`);
        }, 1500);
    }, 1500);
}

// 알림 표시
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>${message}</span>
        </div>
    `;

    // 스타일 추가
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: rgba(16, 185, 129, 0.9);
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;

    // 알림 내용 스타일
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    const icon = notification.querySelector('svg');
    icon.style.cssText = 'width: 20px; height: 20px; flex-shrink: 0;';

    document.body.appendChild(notification);

    // 3초 후 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 빠른 태그 클릭 처리
quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const topic = tag.dataset.topic;
        topicInput.value = topic;
        topicInput.focus();

        // 태그 선택 효과
        quickTags.forEach(t => t.style.background = '');
        tag.style.background = 'rgba(255, 59, 59, 0.2)';
    });
});

// 이벤트 리스너
generateBtn.addEventListener('click', handleGenerate);

topicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGenerate();
    }
});

// 입력 시 진행 단계 초기화
topicInput.addEventListener('input', () => {
    if (topicInput.value.trim().length > 0) {
        updateProgress(0);
    }
});

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from { 
            opacity: 0; 
            transform: translateX(100px); 
        }
        to { 
            opacity: 1; 
            transform: translateX(0); 
        }
    }
    
    @keyframes slideOut {
        from { 
            opacity: 1; 
            transform: translateX(0); 
        }
        to { 
            opacity: 0; 
            transform: translateX(100px); 
        }
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 포커스
window.addEventListener('load', () => {
    setTimeout(() => topicInput.focus(), 100);
});
