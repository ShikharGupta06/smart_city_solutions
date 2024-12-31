document.addEventListener("DOMContentLoaded", async () => {
    const userDisplay = document.getElementById("user-display");
    const loginItem = document.getElementById("login-item");
    const signupItem = document.getElementById("signup-item");

    try {
        const response = await fetch('/api/username');
        if (response.ok) {
            const data = await response.json();
            const username = data.username;

            // Update UI for logged-in user
            userDisplay.textContent = `Welcome, ${username}`;
            userDisplay.style.display = "inline";
            loginItem.style.display = "none";
            signupItem.style.display = "none";

            // Add logout button
            const logoutButton = document.createElement("button");
            logoutButton.textContent = "Logout";
            logoutButton.style.marginLeft = "10px";
            logoutButton.onclick = () => {
                fetch('/api/logout', { method: 'POST' })
                    .then(() => {
                        document.cookie = 'username=; Max-Age=0'; // Clear cookie
                        window.location.reload(); // Refresh page
                    })
                    .catch((error) => console.error('Error logging out:', error));
            };
            userDisplay.appendChild(logoutButton);
        } else {
            // Default layout: User not logged in
            userDisplay.style.display = "none";
            loginItem.style.display = "inline";
            signupItem.style.display = "inline";
        }
    } catch (error) {
        console.error('Error fetching username:', error);
    }
});

// search funtionanlity
window.onload = () => {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const sections = document.querySelectorAll("section");

    searchBtn?.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();

        // Check if the query is empty
        if (!query) {
            alert("Please enter a section name and keyword.");
            return;
        }

        // Split the query into section name and keywords
        const [sectionName, ...keywords] = query.split(" ");
        const keyword = keywords.join(" ").toLowerCase().trim();

        // If there's no keyword, display a message
        if (!keyword) {
            alert("Please enter a keyword to search.");
            return;
        }

        console.log("Search Query:", query);
        console.log("Section Name:", sectionName);
        console.log("Keyword:", keyword);

        let found = false;

        // Loop through each section to find the match
        sections.forEach((section) => {
            const sectionId = section.id.toLowerCase();
            const sectionContent = section.innerText.toLowerCase().trim();

            console.log("Section ID:", sectionId);
            console.log("Section Content:", sectionContent);

            // Match the section ID and check if the content contains the keyword
            if (sectionId.includes(sectionName) && sectionContent.includes(keyword)) {
                section.scrollIntoView({ behavior: "smooth" });
                found = true;
                return; // Stop further checking once a match is found
            }
        });

        // If no match was found, alert the user
        if (!found) {
            alert("No matches found. Please try a different query.");
        }
    });
};

// Define the initMap function
window.initMap = function () {
    // Define the coordinates for the city center
    const cityCenter = { lat: 40.7128, lng: -74.0060 }; // Example: New York City

    // Check if the #map element exists to avoid errors
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error("Map container element (#map) not found.");
        return;
    }

    // create a map object and specify the DOM element for display
    const map = new google.maps.Map(mapContainer, {
        zoom: 12,
        center: cityCenter,
    });

    // Add a marker for the city center
    const marker = new google.maps.Marker({
        position: cityCenter,
        map: map,
        title: "Smart City Center",
    });

    // Example: Add markers for smart city projects
    const projectLocations = [
        { lat: 40.73061, lng: -73.935242, title: "Green Energy Hub" },
        { lat: 40.758896, lng: -73.985130, title: "Smart Traffic System" },
        { lat: 40.748817, lng: -73.985428, title: "IoT Deployment Zone" },
    ];

    projectLocations.forEach(location => {
        new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title,
        });
    });

    //An info window for a marker
    const infoWindow = new google.maps.InfoWindow({
        content: "Explore our smart city projects!",
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
};

//The map is re-initialized when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        initMap(); // Call initMap if the #map element exists
    }
});
