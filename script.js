document.getElementById("toggle_theme").addEventListener("click", () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    const button = document.getElementById("toggle_theme");
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    button.innerHTML = newTheme === "dark" ? "Light Mode" : "Dark Mode";
});

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const button = document.getElementById("toggle_theme");

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    button.innerHTML = "Light Mode";
} else {
    if (!document.documentElement.hasAttribute("data-theme")) {
        document.documentElement.setAttribute("data-theme", "light");
    }
    button.innerHTML = "Dark Mode";
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing clock...");
    
    let currentOffset = 0;
    let updateInterval = null;
    const elements = {
        appData: document.getElementById("app_data"),
        changeGmtBtn: document.getElementById("change_gmt_btn"),
        gmtSelector: document.getElementById("gmt_selector"),
        setTimezoneBtn: document.getElementById("set_timezone"),
        gmtSelect: document.getElementById("gmt_select"),
        updateButton: document.getElementById("update"),
        resetButton: document.getElementById("reset"),
        themeButton: document.getElementById("toggle_theme"),
        statsButton: document.getElementById("show_statistics")
    };

    function parseGMTValue(gmtString) {
        console.log("Parsing GMT:", gmtString);
        
        gmtString = gmtString.trim().toUpperCase();
        
        const match = gmtString.match(/GMT\s*([+-]?)(\d+)/);
        
        if (match) {
            const sign = match[1] === '-' ? -1 : 1;
            const hours = parseInt(match[2]) || 0;
            return sign * hours;
        }
        
        return 0;
    }

    function loadStatistics(selectedValue) {
        console.log("Setting timezone:", selectedValue);
        
        currentOffset = parseGMTValue(selectedValue);
        
        console.log("GMT offset calculated:", currentOffset, "hours");
        
        updateDisplay();
        
        if (!updateInterval) {
            startClockUpdate();
        }
    }
    
    function startClockUpdate() {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        
        updateInterval = setInterval(updateDisplay, 1000);
        
        console.log("Clock updates started");
    }
    
    function updateDisplay() {
        if (!elements.appData) {
            console.error("app_data element not found!");
            return;
        }
        
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();
        
        let targetHours = utcHours + currentOffset;
        
        if (targetHours >= 24) {
            targetHours -= 24;
        } else if (targetHours < 0) {
            targetHours += 24;
        }
        
        const hours = targetHours.toString().padStart(2, '0');
        const minutes = utcMinutes.toString().padStart(2, '0');
        const seconds = utcSeconds.toString().padStart(2, '0');
        
        elements.appData.textContent = `${hours}:${minutes}:${seconds}`;
        
        const offsetSign = currentOffset >= 0 ? '+' : '';
        document.title = `RTClock | GMT${offsetSign}${currentOffset}`;
        
        updateGMTInfo();
    }
    
    function updateGMTInfo() {
        const offsetSign = currentOffset >= 0 ? '+' : '';
        const gmtInfo = `GMT${offsetSign}${currentOffset}`;
        
        console.log("Current timezone:", gmtInfo);
    }

    console.log("Initializing clock...");
    
    loadStatistics("GMT+0");
    
    if (elements.gmtSelect) {
        elements.gmtSelect.value = "GMT+0";
    }

    if (elements.changeGmtBtn && elements.gmtSelector) {
        elements.changeGmtBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Toggle GMT selector");
            elements.gmtSelector.classList.toggle("hide");
        });
    } else {
        console.warn("GMT selector elements not found");
    }
    
    if (elements.setTimezoneBtn && elements.gmtSelect) {
        elements.setTimezoneBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const selectedValue = elements.gmtSelect.value;
            console.log("Changing to:", selectedValue);
            
            if (elements.gmtSelector) {
                elements.gmtSelector.classList.add("hide");
            }
            
            loadStatistics(selectedValue);
        });
    }
    
    if (elements.updateButton) {
        elements.updateButton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Update button clicked");
            updateDisplay();
        });
    }
    
    if (elements.resetButton) {
        elements.resetButton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Resetting to GMT+0");
            
            if (elements.gmtSelect) {
                elements.gmtSelect.value = "GMT+0";
            }
            
            if (elements.gmtSelector) {
                elements.gmtSelector.classList.add("hide");
            }
            
            loadStatistics("GMT+0");
        });
    }
    
    if (elements.themeButton) {
        elements.themeButton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Toggle theme");
            document.body.classList.toggle("light-theme");
            const isLight = document.body.classList.contains("light-theme");
            elements.themeButton.textContent = isLight ? "Dark mode" : "Light mode";
            
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add("light-theme");
            elements.themeButton.textContent = "Dark mode";
        }
    }
    
    if (elements.statsButton) {
        elements.statsButton.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Statistics feature coming soon!");
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (elements.resetButton) {
                elements.resetButton.click();
            }
        }
        
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            if (elements.updateButton) {
                elements.updateButton.click();
            }
        }
        
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            if (elements.themeButton) {
                elements.themeButton.click();
            }
        }
    });
    
    console.log("Clock initialized successfully!");
});