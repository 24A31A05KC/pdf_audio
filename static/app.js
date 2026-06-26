const synth = window.speechSynthesis;

// Standard capture hooks references mapping parameters components setup definitions properties
const initialUploadBox = document.getElementById('initialUploadBox');
const splitWorkspaceGrid = document.getElementById('splitWorkspaceGrid');
const sideConsoleDrawer = document.getElementById('sideConsoleDrawer');

const uploadForm = document.getElementById('uploadForm');
const pdfFileInput = document.getElementById('pdfFile');
const fileInputStatusText = document.getElementById('fileInputStatusText');
const currentFileName = document.getElementById('currentFileName');
const processBtn = document.getElementById('processBtn');
const statusMessage = document.getElementById('statusMessage');

const sidebarUploadForm = document.getElementById('sidebarUploadForm');
const sidebarPdfFile = document.getElementById('sidebarPdfFile');
const sidebarFileStatusText = document.getElementById('sidebarFileStatusText');
const sidebarProcessBtn = document.getElementById('sidebarProcessBtn');

const voiceSelect = document.getElementById('voiceSelect');
const speedRange = document.getElementById('speedRange');
const speedVal = document.getElementById('speedVal');
const textDisplayContainer = document.getElementById('textDisplayContainer');
const pdfIframeWrapper = document.getElementById('pdfIframeWrapper');
const paginationPageTrackText = document.getElementById('paginationPageTrackText');

const jumpToPageInputField = document.getElementById('jumpToPageInputField');
const jumpToPageSubmitBtn = document.getElementById('jumpToPageSubmitBtn');

const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeDrawerX = document.getElementById('closeDrawerX');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');

const globalProcessingLoader = document.getElementById('globalProcessingLoader');
const loaderProgressText = document.getElementById('loaderProgressText');
const loaderPercentProgressBar = document.getElementById('loaderPercentProgressBar');
const loaderPercentNumericCounter = document.getElementById('loaderPercentNumericCounter');

const tourTooltipWidget = document.getElementById('tourTooltipWidget');
const tourStepTitle = document.getElementById('tourStepTitle');
const tourStepDescription = document.getElementById('tourStepDescription');
const tourNextBtn = document.getElementById('tourNextBtn');
const tourSkipBtn = document.getElementById('tourSkipBtn');

const customTourPromptPopup = document.getElementById('customTourPromptPopup');
const tourDeclineBtn = document.getElementById('tourDeclineBtn');
const tourAcceptBtn = document.getElementById('tourAcceptBtn');

const customPlayPromptPopup = document.getElementById('customPlayPromptPopup');
const playDeclineBtn = document.getElementById('playDeclineBtn');
const playConfirmBtn = document.getElementById('playConfirmBtn');

const leftPdfCard = document.getElementById('leftPdfCard');
const rightTextCard = document.getElementById('rightTextCard');
const maximizeLeftBtn = document.getElementById('maximizeLeftBtn');
const maximizeRightBtn = document.getElementById('maximizeRightBtn');
const leftZoomIcon = document.getElementById('leftZoomIcon');
const rightZoomIcon = document.getElementById('rightZoomIcon');

const lightThemeBtn = document.getElementById('lightThemeBtn');
const darkThemeBtn = document.getElementById('darkThemeBtn');

// LIGHTNING FAST CHUNK PAGINATION CACHE RUNTIME DATA REGISTERS
let pdfPagesCachedDataset = [];
let activePageCursorIndex = 0;
let wordsArray = [];
let currentWordIndex = 0;
let currentUtterance = null;
let activeTourStepIdx = 0;
let tourStepsConfigList = [];
let temporarySelectedWordIndex = 0;

let activeMountedDocumentTargetNamePrefixString = "VoiceDoc_AI_Audio";

// 🟢 NEW GLOBAL POINTER AUDIO ENGINE VOICE PROFILE MAPS REGISTERS
let mappedAvatarVoicesDataset = { ben: null, james: null, ruby: null };
let activeSelectedPersonaIdString = "ben";

lightThemeBtn.addEventListener('click', () => {
    document.documentElement.classList.remove('dark');
    lightThemeBtn.className = "border border-purpleAccent-500 bg-purpleAccent-600 text-white py-1.5 rounded-xl text-xs font-bold transition shadow";
    darkThemeBtn.className = "border border-slate-300 bg-slate-100 dark:bg-slate-900 text-slate-800 py-1.5 rounded-xl text-xs font-bold transition";
});
darkThemeBtn.addEventListener('click', () => {
    document.documentElement.classList.add('dark');
    darkThemeBtn.className = "border border-purpleAccent-500 bg-purpleAccent-600 text-white py-1.5 rounded-xl text-xs font-bold transition shadow";
    lightThemeBtn.className = "border border-slate-300 bg-slate-100 dark:bg-slate-900 text-slate-800 py-1.5 rounded-xl text-xs font-bold transition";
});

maximizeLeftBtn.addEventListener('click', () => {
    if(leftPdfCard.classList.contains('md:col-span-2')) {
        leftPdfCard.className = "bg-white dark:bg-slate-800 rounded-2xl border border-purpleAccent-100 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col workspace-view-card transition-all duration-200";
        rightTextCard.className = "bg-white dark:bg-slate-800 rounded-2xl border border-purpleAccent-100 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col workspace-view-card justify-between transition-all duration-200";
        leftZoomIcon.className = "fa-solid fa-expand";
    } else {
        leftPdfCard.className = "bg-white dark:bg-slate-800 rounded-2xl border border-purpleAccent-100 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col workspace-view-card transition-all duration-200 md:col-span-2 w-full";
        rightTextCard.className = "hidden";
        leftZoomIcon.className = "fa-solid fa-compress";
    }
});
maximizeRightBtn.addEventListener('click', () => {
    if(rightTextCard.classList.contains('md:col-span-2')) {
        leftPdfCard.className = "bg-white dark:bg-slate-800 rounded-2xl border border-purpleAccent-100 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col workspace-view-card transition-all duration-200";
        rightTextCard.className = "bg-white dark:bg-slate-800 rounded-2xl border border-purpleAccent-100 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col workspace-view-card justify-between transition-all duration-200";
        rightZoomIcon.className = "fa-solid fa-expand";
    } else {
        rightTextCard.className = "bg-white dark:bg-slate-800 rounded-2xl border border-purpleAccent-100 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col workspace-view-card justify-between transition-all duration-200 md:col-span-2 w-full";
        leftPdfCard.className = "hidden";
        rightZoomIcon.className = "fa-solid fa-compress";
    }
});

function triggerDrawerOpen() { sideConsoleDrawer.classList.remove('-translate-x-full'); }
function triggerDrawerClose() { sideConsoleDrawer.classList.add('-translate-x-full'); }
hamburgerBtn.addEventListener('click', () => {
    if(sideConsoleDrawer.classList.contains('-translate-x-full')) triggerDrawerOpen(); else triggerDrawerClose();
});
closeDrawerX.addEventListener('click', triggerDrawerClose);

// Fully re-patched voice populator to handle smart native Telugu character languages detection mappings hooks
function populateAudioVoices() {
    let voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    
    if(voices.length === 0) return;

    // 🕵️‍♂️ SMART LANGUAGE DETECTOR HOOKS FOR BEN, JAMES, AND RUBY
    let usMaleVoice = voices.find(v => v.lang.includes('en-US') && (v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ben')));
    let ukMaleVoice = voices.find(v => v.lang.includes('en-GB') && (v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('james')));
    
    // 🟢 TELUGU HARDWARE DETECTION: Intercepts native Microsoft Heera or Android Telugu audio synthesis packs profiles
    let teluguNativeVoice = voices.find(v => v.lang.includes('te-IN') || v.lang.includes('te_IN'));

    // Broad boundaries safety fallback updates logic markers if system language packages are missing
    if(!usMaleVoice) usMaleVoice = voices.find(v => v.lang.includes('en'));
    if(!ukMaleVoice) ukMaleVoice = voices.find(v => v.lang.includes('en'));
    if(!teluguNativeVoice) {
        teluguNativeVoice = voices.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'));
        const rubyNode = document.getElementById('rubyLangTag');
        if(rubyNode) rubyNode.textContent = "ENG (IN)*";
    } else {
        const rubyNode = document.getElementById('rubyLangTag');
        if(blockNode) rubyLangTag.textContent = "TELUGU";
    }

    // Cache instances mappings references pointers logic trackers parameters safely
    mappedAvatarVoicesDataset.ben = usMaleVoice || voices[0];
    mappedAvatarVoicesDataset.james = ukMaleVoice || voices[0];
    mappedAvatarVoicesDataset.ruby = teluguNativeVoice || voices[0];
}

// 🟢 NEW AVATAR SELECTION ACTION HANDLER INTERCEPTOR 
window.selectSpeakerAvatarPersonaVoice = function(personaIdStr) {
    activeSelectedPersonaIdString = personaIdStr;
    
    // UI Cards state switches borders rendering configurations
    const cardIdsList = ['ben', 'james', 'ruby'];
    cardIdsList.forEach(id => {
        const btnElementNode = document.getElementById(`avatarCard${id.charAt(0).toUpperCase() + id.slice(1)}Btn`);
        if(btnElementNode) {
            if(id === personaIdStr) {
                btnElementNode.className = "flex flex-col items-center justify-center p-3 bg-purpleAccent-100/50 dark:bg-slate-900 border-2 border-purpleAccent-600 rounded-xl shadow-sm hover:scale-[1.03] transition-all duration-150 group";
                const spanNode = btnElementNode.querySelector('span');
                if(spanNode) spanNode.className = "text-[11px] font-black tracking-wide text-purpleAccent-800 dark:text-white block";
            } else {
                btnElementNode.className = "flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:scale-[1.03] transition-all duration-150 group";
                const spanNode = btnElementNode.querySelector('span');
                if(spanNode) spanNode.className = "text-[11px] font-black tracking-wide text-slate-700 dark:text-slate-300 block";
            }
        }
    });

    // If stream audio session is already speaking middle, auto-refresh rate sync immediately
    if (synth.speaking) {
        let wasSpeechSessionPausedBool = synth.paused;
        startAudioSyllableSyncEngine(currentWordIndex);
        if(wasSpeechSessionPausedBool) synth.pause();
    }
};

populateAudioVoices();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = populateAudioVoices;

pdfFileInput.addEventListener('change', (e) => {
    if(e.target.files.length > 0) fileInputStatusText.textContent = `Attached: ${e.target.files[0].name}`;
});
sidebarPdfFile.addEventListener('change', (e) => {
    if(e.target.files.length > 0) sidebarFileStatusText.textContent = e.target.files[0].name;
});

// ================= SPEED OPTIMIZED DATA MOUNT LAYER HANDLERS =================
async function executeMasterDocumentExtractionPipeline(fileObject) {
    triggerPercentageLoaderTimeline(true, "Extracting text structure matrices... Fast loading modules dashboard active.");
    
    let splitExtArray = fileObject.name.split('.');
    splitExtArray.pop();
    activeMountedDocumentTargetNamePrefixString = splitExtArray.join('.');
    currentFileName.textContent = fileObject.name;

    // Direct object references setup model bounds 
    const isWordDocFile = fileObject.name.toLowerCase().endsWith('.doc') || fileObject.name.toLowerCase().endsWith('.docx');
    
    if(!isWordDocFile) {
        const blobUrl = URL.createObjectURL(fileObject);
        pdfIframeWrapper.innerHTML = `<iframe src="${blobUrl}" class="w-full h-full rounded-xl border-0 bg-slate-900" style="background:#111827;"></iframe>`;
    }

    const formData = new FormData();
    formData.append('file', fileObject);

    let progressCounter = 0;
    let linearTimerInterval = setInterval(() => {
        if(progressCounter < 90) {
            progressCounter += Math.floor(Math.random() * 12) + 3;
            updatePercentageLoaderMetrics(progressCounter);
        }
    }, 100);

    try {
        const response = await fetch('/extract-text', { method: 'POST', body: formData });
        const data = await response.json();

        clearInterval(linearTimerInterval);

        if (response.ok) {
            updatePercentageLoaderMetrics(100);
            pdfPagesCachedDataset = data.pages;
            activePageCursorIndex = 0;
            
            // 🟢 FIXED WORD PREVIEW RENDER: If Word document payload detected, mount pure structured readable sheets canvas internally into the left blueprint view viewport instantly!
            if(isWordDocFile) {
                renderWordDocumentPreviewInLeftViewport();
            }

            renderTargetSinglePageSheetLayer(activePageCursorIndex);
            jumpToPageInputField.max = pdfPagesCachedDataset.length;
            
            setTimeout(() => {
                triggerPercentageLoaderTimeline(false);
                initialUploadBox.classList.add('hidden');
                splitWorkspaceGrid.classList.remove('hidden');
                downloadBtn.disabled = false;
                customTourPromptPopup.classList.remove('hidden');
            }, 300);
        } else {
            triggerPercentageLoaderTimeline(false);
            alert(data.error || "System compilation error caught context logic.");
        }
    } catch (err) {
        clearInterval(linearTimerInterval);
        triggerPercentageLoaderTimeline(false);
        alert("Backend data stream channel integration connection failed.");
    }
}

// 🟢 NEWLY ADDED: Generates elegant high-fidelity text preview container inside left panel for MS Word scripts natively!
function renderWordDocumentPreviewInLeftViewport() {
    pdfIframeWrapper.innerHTML = "";
    
    const wordPreviewCard = document.createElement('div');
    wordPreviewCard.className = "w-full h-full overflow-y-auto p-4 bg-white dark:bg-slate-900 rounded-xl border border-purpleAccent-200/40 shadow-inner select-text flex flex-col gap-4 font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-100 text-justify";
    
    pdfPagesCachedDataset.forEach((pageContentText, index) => {
        const blockNode = document.createElement('div');
        blockNode.className = "p-6 bg-purpleAccent-50/20 dark:bg-slate-950/40 rounded-xl border border-purpleAccent-100/50 shadow-sm relative pt-10";
        blockNode.id = `left-word-preview-sheet-${index}`;
        blockNode.innerHTML = `
            <span class="absolute top-2 left-3 font-mono text-[9px] font-black text-purpleAccent-600 tracking-widest uppercase">📄 Document Page Section - Track ${index + 1}</span>
            ${pageContentText.replace(/\n/g, '<br>')}
        `;
        wordPreviewCard.appendChild(blockNode);
    });
    
    pdfIframeWrapper.appendChild(wordPreviewCard);
}

uploadForm.addEventListener('submit', (e) => { e.preventDefault(); executeMasterDocumentExtractionPipeline(pdfFileInput.files[0]); });
sidebarUploadForm.addEventListener('submit', (e) => {
    e.preventDefault(); synth.cancel(); triggerDrawerClose();
    executeMasterDocumentExtractionPipeline(sidebarPdfFile.files[0]);
});

function renderTargetSinglePageSheetLayer(pageIdx) {
    if(pdfPagesCachedDataset.length === 0 || pageIdx >= pdfPagesCachedDataset.length) return;
    
    textDisplayContainer.innerHTML = "";
    paginationPageTrackText.textContent = `Page ${pageIdx + 1} / ${pdfPagesCachedDataset.length}`;
    jumpToPageInputField.value = pageIdx + 1;
    
    let targetPageTextStr = pdfPagesCachedDataset[pageIdx];

    const pageHeaderLabel = document.createElement('div');
    pageHeaderLabel.className = "max-w-xl mx-auto text-[10px] font-mono text-purpleAccent-700 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest";
    pageHeaderLabel.textContent = `--- ACTIVE WORKSPACE SHEET - LAYER VIEWPORT INDEX: ${pageIdx + 1} ---`;
    textDisplayContainer.appendChild(pageHeaderLabel);

    const sheetWrapper = document.createElement('div');
    sheetWrapper.className = "pdf-page-block-mock mx-auto max-w-xl p-8 md:p-10 rounded-xl select-text text-justify transition-all duration-200 mt-2";
    sheetWrapper.id = `pdf-active-page-sheet-box`;

    let cleanedTextLineDump = targetPageTextStr.replace(/\s+/g, ' ').trim();
    let wordTokensCountInt = cleanedTextLineDump.split(' ').length;

    if(targetPageTextStr === "__IMAGE_DETECTED_WARNING_TRIGGER_FLAG__" || wordTokensCountInt < 9 || cleanedTextLineDump.length < 45) {
        let optionalHeadingTitleStr = cleanedTextLineDump.length > 2 ? cleanedTextLineDump : "Graphic Slide Layer Node Detected";
        
        sheetWrapper.className += " border-2 border-red-200 bg-red-50/50 text-red-700 font-sans py-10 px-6 font-medium relative";
        sheetWrapper.innerHTML = `
            <div class="text-left border-b border-red-200 pb-2 mb-4 font-serif text-lg font-bold text-slate-800 dark:text-slate-900">
                📌 Title: ${optionalHeadingTitleStr}
            </div>
            <div class="text-center py-6">
                <div class="text-2xl mb-2 text-red-500"><i class="fa-solid fa-triangle-exclamation animate-pulse"></i></div>
                <p class="text-xs leading-relaxed max-w-sm mx-auto font-sans">
                    We have detected an image which can't be processed now, so please check the PDF in the right side to understand.
                </p>
            </div> `;
        wordsArray = [];
        currentWordIndex = 0;
    } else {
        wordsArray = targetPageTextStr.split(/(\s+)/);
        currentWordIndex = 0;
        
        wordsArray.forEach((part, index) => {
            const span = document.createElement('span');
            span.textContent = part;
            span.id = `w-token-${index}`;
            sheetWrapper.appendChild(span);
        });
        sheetWrapper.addEventListener('mouseup', handleUserSelectionToSkipAudioPlaybackTrigger);
    }
    
    textDisplayContainer.appendChild(sheetWrapper);
    
    // 🟢 DYNAMIC SYNCHRONIZED SCROLL FOCUS FOR LEFT MS WORD VIEWPORT:
    // Left side word document preview layer automated scrolls matching current paginated workspace index instantly!
    const activeLeftSheetNode = document.getElementById(`left-word-preview-sheet-${pageIdx}`);
    const leftScrollParent = pdfIframeWrapper.querySelector('div');
    if(activeLeftSheetNode && leftScrollParent) {
        leftScrollParent.scrollTop = activeLeftSheetNode.offsetTop - 20;
    }
}

prevPageBtn.addEventListener('click', () => {
    if(activePageCursorIndex > 0) { synth.cancel(); activePageCursorIndex--; renderTargetSinglePageSheetLayer(activePageCursorIndex); }
});
nextPageBtn.addEventListener('click', () => {
    if(activePageCursorIndex < pdfPagesCachedDataset.length - 1) { synth.cancel(); activePageCursorIndex++; renderTargetSinglePageSheetLayer(activePageCursorIndex); }
});

function executeProgrammaticPageJumpAction() {
    let targetedPageNumInt = parseInt(jumpToPageInputField.value);
    if(targetedPageNumInt && targetedPageNumInt >= 1 && targetedPageNumInt <= pdfPagesCachedDataset.length) {
        synth.cancel();
        activePageCursorIndex = targetedPageNumInt - 1;
        renderTargetSinglePageSheetLayer(activePageCursorIndex);
        showStatus(`Directly jumped speech viewport tracker parameters to Page: ${targetedPageNumInt}`, "text-purpleAccent-700 dark:text-emerald-400");
    } else {
        alert(`Invalid scope range! Choose: 1 to ${pdfPagesCachedDataset.length}`);
        jumpToPageInputField.value = activePageCursorIndex + 1;
    }
}
jumpToPageSubmitBtn.addEventListener('click', executeProgrammaticPageJumpAction);
jumpToPageInputField.addEventListener('keyup', (e) => { if(e.key === "Enter") executeProgrammaticPageJumpAction(); });

function triggerPercentageLoaderTimeline(visibleBool, statusMsgStr = "") {
    if(visibleBool) {
        loaderProgressText.textContent = statusMsgStr;
        updatePercentageLoaderMetrics(0);
        globalProcessingLoader.classList.remove('hidden');
    } else { globalProcessingLoader.classList.add('hidden'); }
}
function updatePercentageLoaderMetrics(percentageValInt) {
    loaderPercentProgressBar.style.width = `${percentageValInt}%`;
    loaderPercentNumericCounter.textContent = `${percentageValInt}%`;
}

tourAcceptBtn.addEventListener('click', () => { customTourPromptPopup.classList.add('hidden'); triggerProductionAppGuidedTour(); });
tourDeclineBtn.addEventListener('click', () => { customTourPromptPopup.classList.add('hidden'); showStatus("Tutorial skipped. Workspace dashboard unlocked completely.", "text-purpleAccent-700 dark:text-emerald-400"); });

playDeclineBtn.addEventListener('click', () => { customPlayPromptPopup.classList.add('hidden'); window.getSelection().removeAllRanges(); });
playConfirmBtn.addEventListener('click', () => {
    customPlayPromptPopup.classList.add('hidden');
    currentWordIndex = temporarySelectedWordIndex;
    startAudioSyllableSyncEngine(currentWordIndex);
    window.getSelection().removeAllRanges();
});

function triggerProductionAppGuidedTour() {
    tourStepsConfigList = [
        { elementId: "hamburgerBtn", title: "1. Navigation Console", desc: "Click this sidebar menu switch anytime to manage voices settings skins options or file downloads controls layout." },
        { elementId: "pdfIframeWrapper", title: "2. Absolute Blueprint Sheet", desc: "This bounded view page locks layout display original textbook PDF or your Word document previews text beautifully scrollable." },
        { elementId: "tourPaginationControlsHeader", title: "3. Smart Numeric Pagination Bar", desc: "Use left/right caret arrow buttons or type a page number in the numeric shortcut box to instantly jump to specific page indices!" },
        { elementId: "textDisplayContainer", title: "4. Live Audio Tracking Canvas", desc: "Extracted textbook script content mounts onto this page panel. Words will highlight yellow synchronously during active playback loops stream data profiles." },
        { elementId: "floatingAudioDock", title: "5. Unified Audio Controller Dock", desc: "Use music-app style PLAY PAUSE STOP switches or adjusting rates speed slider instantly here on-the-fly without extra button re-hits commands." }
    ];
    activeTourStepIdx = 0;
    executeActiveTourStepOverlay(activeTourStepIdx);
}
function executeActiveTourStepOverlay(stepIdx) {
    document.querySelectorAll('.tour-active-highlight').forEach(el => el.classList.remove('tour-active-highlight'));
    if(stepIdx >= tourStepsConfigList.length) {
        tourTooltipWidget.classList.add('hidden');
        showStatus("Dashboard system training tour completed. Production panel fully unlocked!", "text-purpleAccent-700 dark:text-emerald-400");
        return;
    }
    const currentStepData = tourStepsConfigList[stepIdx];
    const targetUIElement = document.getElementById(currentStepData.elementId);
    if(targetUIElement) {
        targetUIElement.classList.add('tour-active-highlight');
        const rect = targetUIElement.getBoundingClientRect();
        tourStepTitle.textContent = currentStepData.title;
        tourStepDescription.textContent = currentStepData.desc;
        let computedTop = rect.bottom + window.scrollY + 12;
        let computedLeft = rect.left + window.scrollX + (rect.width / 2) - 160;
        if (computedTop + 160 > window.innerHeight + window.scrollY) { computedTop = rect.top + window.scrollY - 180; }
        if (computedLeft < 10) computedLeft = 10;
        if (computedLeft + 320 > window.innerWidth) computedLeft = window.innerWidth - 330;
        tourTooltipWidget.style.top = `${computedTop}px`;
        tourTooltipWidget.style.left = `${computedLeft}px`;
        tourTooltipWidget.classList.remove('hidden');
    } else { activeTourStepIdx++; executeActiveTourStepOverlay(activeTourStepIdx); }
}
tourNextBtn.addEventListener('click', () => { activeTourStepIdx++; executeActiveTourStepOverlay(activeTourStepIdx); });
tourSkipBtn.addEventListener('click', () => { document.querySelectorAll('.tour-active-highlight').forEach(el => el.classList.remove('tour-active-highlight')); tourTooltipWidget.classList.add('hidden'); });

function handleUserSelectionToSkipAudioPlaybackTrigger() {
    const activeSelectionObj = window.getSelection();
    if (!activeSelectionObj || activeSelectionObj.toString().trim() === "") return;
    const anchorNodeSpanElement = activeSelectionObj.anchorNode.parentElement;
    if (anchorNodeSpanElement && anchorNodeSpanElement.id && anchorNodeSpanElement.id.startsWith("w-token-")) {
        temporarySelectedWordIndex = parseInt(anchorNodeSpanElement.id.split("-")[2]);
        customPlayPromptPopup.classList.remove('hidden');
    }
}

function startAudioSyllableSyncEngine(index) {
    synth.cancel();
    if (wordsArray.length === 0) return;
    let remainingText = wordsArray.slice(index).join(''); if (!remainingText.trim()) return;
    currentUtterance = new SpeechSynthesisUtterance(remainingText);
    
    // 🟢 ASSIGN PROFILE PERSONA FROM AVATAR DATA REGISTER SELECTION HOOK
    if(mappedAvatarVoicesDataset[activeSelectedPersonaIdString]) {
        currentUtterance.voice = mappedAvatarVoicesDataset[activeSelectedPersonaIdString];
    }
    
    currentUtterance.rate = parseFloat(speedRange.value);

    currentUtterance.onboundary = (event) => {
        if (event.name === 'word') {
            let charOffset = event.charIndex; let currentLength = 0;
            for (let i = index; i < wordsArray.length; i++) {
                if (currentLength === charOffset) { currentWordIndex = i; executeHighlightFocusScrollTracker(i); break; }
                currentLength += wordsArray[i].length;
            }
        }
    };
    currentUtterance.onend = () => {
        if(!synth.paused && currentWordIndex >= wordsArray.length - 1) {
            if(activePageCursorIndex < pdfPagesCachedDataset.length - 1) {
                activePageCursorIndex++;
                renderTargetSinglePageSheetLayer(activePageCursorIndex);
                startAudioSyllableSyncEngine(0);
            }
        }
    };
    synth.speak(currentUtterance);
}

// Global highlight and synchronize view scroll functions metrics models logic handles updates parameters
function executeHighlightFocusScrollTracker(wordIdx) {
    const marks = textDisplayContainer.querySelectorAll('.highlight');
    marks.forEach(el => el.classList.remove('highlight'));
    const activeSpan = document.getElementById(`w-token-${wordIdx}`);
    if (activeSpan && activeSpan.textContent.trim()) {
        activeSpan.className = "highlight";
        const parentContainer = textDisplayContainer;
        const childOffsetTop = activeSpan.offsetTop;
        parentContainer.scrollTop = childOffsetTop - (parentContainer.clientHeight / 2);
    }
}

playBtn.addEventListener('click', () => {
    if (synth.paused) { synth.resume(); return; }
    startAudioSyllableSyncEngine(currentWordIndex);
});
pauseBtn.addEventListener('click', () => { if (synth.speaking && !synth.paused) synth.pause(); });
stopBtn.addEventListener('click', () => {
    synth.cancel(); currentWordIndex = 0; activePageCursorIndex = 0;
    renderTargetSinglePageSheetLayer(activePageCursorIndex);
});
speedRange.addEventListener('input', (e) => {
    speedVal.textContent = e.target.value + 'x';
    if (synth.speaking) { let wp = synth.paused; startAudioSyllableSyncEngine(currentWordIndex); if(wp) synth.pause(); }
});
voiceSelect.addEventListener('change', () => {
    if (synth.speaking) { let wp = synth.paused; startAudioSyllableSyncEngine(currentWordIndex); if(wp) synth.pause(); }
});

downloadBtn.addEventListener('click', async () => {
    triggerDrawerClose();
    
    triggerPercentageLoaderTimeline(true, "Stage 1/2: Contacting backend studio compilers... Transforming data tracks.");
    updatePercentageLoaderMetrics(20);
    
    try {
        let simulatedProgressTrackerInt = 20;
        let linearLoadingInterval = setInterval(() => {
            if (simulatedProgressTrackerInt < 85) {
                simulatedProgressTrackerInt += Math.floor(Math.random() * 5) + 1;
                updatePercentageLoaderMetrics(simulatedProgressTrackerInt);
            }
        }, 250);

        const networkDownloadFileResponse = await fetch('/download-audio', {
            method: 'GET',
            headers: { 'Accept': 'audio/mp3' },
            cache: 'no-store'
        });

        clearInterval(linearLoadingInterval);
        
        if (!networkDownloadFileResponse.ok) {
            triggerPercentageLoaderTimeline(false);
            alert("Backend cloud text compiler runtime synthesis pipeline processing failed.");
            return;
        }

        updatePercentageLoaderMetrics(90);
        loaderProgressText.textContent = "Stage 2/2: Flushing data packets variables caches into local browser workspace directories storage frames.";

        const directFileBlobPayloadData = await networkDownloadFileResponse.blob();
        updatePercentageLoaderMetrics(100);
        
        setTimeout(() => {
            triggerPercentageLoaderTimeline(false);
            
            const binaryObjectStreamLocalBlobPathUrl = window.URL.createObjectURL(directFileBlobPayloadData);
            const nativeFileSystemDownloadLinkAnchor = document.createElement('a');
            nativeFileSystemDownloadLinkAnchor.style.display = 'none';
            nativeFileSystemDownloadLinkAnchor.href = binaryObjectStreamLocalBlobPathUrl;
            
            nativeFileSystemDownloadLinkAnchor.download = `${activeMountedDocumentTargetNamePrefixString}.mp3`;
            
            document.body.appendChild(nativeFileSystemDownloadLinkAnchor);
            nativeFileSystemDownloadLinkAnchor.click();
            
            setTimeout(() => {
                document.body.removeChild(nativeFileSystemDownloadLinkAnchor);
                window.URL.revokeObjectURL(binaryObjectStreamLocalBlobPathUrl);
            }, 150);
            
            showStatus("Audio track downloaded safely with original file name configuration!", "text-purpleAccent-700 font-bold");
        }, 400);

    } catch (networkFetchPipelineExceptionTrace) {
        triggerPercentageLoaderTimeline(false);
        alert(`Frontend network data stream fetching layers error block: ${networkFetchPipelineExceptionTrace.message}`);
    }
});

function showStatus(msg, colorClass) {
    statusMessage.className = `bg-purpleAccent-100 dark:bg-slate-950 p-2.5 rounded-xl border border-purpleAccent-200 dark:border-slate-900 text-[10px] text-center font-medium block ${colorClass}`;
    statusMessage.textContent = msg; statusMessage.classList.remove('hidden');
}