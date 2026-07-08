document.addEventListener('DOMContentLoaded', () => {
    
    // --- Hamburger / Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('data-target');

            sections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                requestAnimationFrame(() => {
                    targetSection.classList.add('active');
                });
            }

            // Close the mobile nav after a link is tapped
            if (mainNav && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', false);
            }

            // Scroll to top of content on page switch (helpful on mobile)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- Countdown Timer Logic ---
    const weddingDate = new Date("January 9, 2027 13:00:00").getTime();
    
    const timerInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const dayElement = document.getElementById("days-left");
        
        if (dayElement) {
            dayElement.innerText = days;
        }

        if (distance < 0) {
            clearInterval(timerInterval);
            const container = document.getElementById("countdown-container");
            if (container) {
                container.innerHTML = "<span class='label'>We're Married!</span>";
            }
        }
    }, 1000);

    // --- LIGHTBOX LOGIC ---
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    const galleryImages = document.querySelectorAll('.gallery-card img');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Swipe support for mobile lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // threshold to distinguish swipe from tap
            if (diff > 0) {
                showNextImage(); // swipe left = next
            } else {
                showPrevImage(); // swipe right = prev
            }
        }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // --- Q&A ACCORDION LOGIC ---
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const questionBtn = item.querySelector('.accordion-question');
        
        questionBtn.addEventListener('click', () => {
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

    // --- RSVP LOGIC ---
    const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw_mt2SzcQaITzSRdvEEcJUnk8LYEW1BdGkBgsLqus-1qlp-JR84zjjV_mIKQEk1UiR/exec";

    let currentPartyGuests = []; 
    let finalResponses = []; 

    const searchSection = document.getElementById('searchSection');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchError = document.getElementById('searchError');
    const suiteSection = document.getElementById('suiteSection');
    const guestListContainer = document.getElementById('guestListContainer');
    const submitBtn = document.getElementById('submitBtn');
    const successSection = document.getElementById('successSection');

    async function performSearch() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        if (!firstName || !lastName) return;

        document.getElementById('searchText').classList.add('hidden');
        document.getElementById('searchLoader').classList.remove('hidden');
        searchBtn.disabled = true;
        searchError.classList.add('hidden');

        try {
            const response = await fetch(GOOGLE_WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'search', firstName: firstName, lastName: lastName })
            });
            
            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
                currentPartyGuests = result.data;
                
                finalResponses = currentPartyGuests.map(g => ({
                    originalFirstName: g['First Name(s)'],
                    originalLastName: g['Last Name(s)'],
                    newFirstName: g['First Name(s)'],
                    newLastName: g['Last Name(s)'],
                    attending: g['Attending'] || '',
                    rowNumber: g._sheetRowNumber
                }));

                buildGuestList();
                
                searchSection.classList.add('hidden');
                suiteSection.classList.remove('hidden');
            } else {
                throw new Error(result.error || "Guest not found");
            }
        } catch (error) {
            console.error("Search Error:", error);
            searchError.textContent = error.message; 
            searchError.classList.remove('hidden');
        } finally {
            document.getElementById('searchText').classList.remove('hidden');
            document.getElementById('searchLoader').classList.add('hidden');
            searchBtn.disabled = false;
        }
    }

    if(searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        firstNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') lastNameInput.focus(); });
        lastNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
    }

    function buildGuestList() {
    guestListContainer.innerHTML = ''; 
    let hasGuest = false;

    currentPartyGuests.forEach((guest, index) => {
        const fName = guest['First Name(s)'];
        const lName = guest['Last Name(s)'];
        const isGuestPlaceholder = fName.trim().toLowerCase() === 'guest';
        
        if (isGuestPlaceholder) hasGuest = true;

        const htmlId = `guest_${index}`;
        const safeFName = fName.replace(/'/g, "\\'");
        const safeLName = lName.replace(/'/g, "\\'");

        // If it's a placeholder, render inputs. Otherwise, just text.
        const nameUI = isGuestPlaceholder ? `
            <div class="guest-name-inputs">
                <input type="text" placeholder="Guest's First Name" class="name-input" required
                       oninput="updateGuestName('${safeFName}', '${safeLName}', this.value, 'first')">
                <input type="text" placeholder="Guest's Last Name" class="name-input" value="${lName !== 'Guest' ? lName : ''}" required
                       oninput="updateGuestName('${safeFName}', '${safeLName}', this.value, 'last')">
            </div>
        ` : `<h4>${fName} ${lName}</h4>`;

        const guestHTML = `
            <div class="guest-row">
                ${nameUI}
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="attending_${htmlId}" value="Yes" class="radio-input" 
                               onchange="updateAttendance('${safeFName}', '${safeLName}', 'Yes')">
                        <div class="radio-box"></div>
                        Joyfully Accepts
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="attending_${htmlId}" value="No" class="radio-input" 
                               onchange="updateAttendance('${safeFName}', '${safeLName}', 'No')">
                        <div class="radio-box"></div>
                        Regretfully Declines
                    </label>
                </div>
            </div>
        `;
        guestListContainer.insertAdjacentHTML('beforeend', guestHTML);
    });

    // Add the instruction text if someone has a plus-one
    if (hasGuest) {
        const instructionHTML = `
            <p class="section-subtitle" style="margin-top: 0px; margin-bottom: 20px; font-style: italic;">
                We have reserved a plus one for you! Please type the first and last name of your guest below.
            </p>`;
        guestListContainer.insertAdjacentHTML('afterbegin', instructionHTML);
    }
}

    window.updateGuestName = function(origFName, origLName, newName, type) {
    const guestRecord = finalResponses.find(g => 
        g.originalFirstName === origFName && g.originalLastName === origLName
    );
    if (guestRecord) {
        if (type === 'first') guestRecord.newFirstName = newName.trim();
        if (type === 'last') guestRecord.newLastName = newName.trim();
    }
};

window.updateAttendance = function(origFName, origLName, status) {
    const guestRecord = finalResponses.find(g => 
        g.originalFirstName === origFName && g.originalLastName === origLName
    );
    
    if (guestRecord) {
        guestRecord.attending = status;
    } else {
        // This will print to your browser's developer console if there's a mismatch
        console.error("Uh oh, couldn't find a match for:", origFName, origLName); 
    }
};

    if(submitBtn) {
        submitBtn.addEventListener('click', async () => {
            console.log("Final Responses State Before Submit:", finalResponses);
            const missingResponses = finalResponses.some(g => g.attending === '');
            if (missingResponses) {
                alert("Please select an RSVP response for every member of your party.");
                return;
            }

            document.getElementById('submitText').classList.add('hidden');
            document.getElementById('submitLoader').classList.remove('hidden');
            submitBtn.disabled = true;

            try {
                const response = await fetch(GOOGLE_WEB_APP_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'submit', guests: finalResponses })
                });

                const result = await response.json();
                
                if (result.success) {
                    suiteSection.classList.add('hidden');
                    successSection.classList.remove('hidden');
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error("Submit Error:", error);
                alert("There was an error submitting your RSVP. Please try again.");
                document.getElementById('submitText').classList.remove('hidden');
                document.getElementById('submitLoader').classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }
});