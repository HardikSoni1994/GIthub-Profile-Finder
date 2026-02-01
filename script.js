// --- 1. Variables (HTML Elements) ---
const search = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const profile = document.getElementById('profile');
const repo = document.getElementById('repo');

// --- 2. Main Function (Pehle declare kar diya) ---
async function getGitHubUsersData(username) {
    const basePoint = "https://api.github.com/users/";
    const userAPI = basePoint + username;
    const userRepoAPI = basePoint + username + "/repos?sort=created";

    try {
        console.log("Searching starts for:", username);

        // Loading Screen
        profile.innerHTML = "<h3>Loading... ⏳</h3>";
        repo.innerHTML = "";

        // API Call (Promise.all)
        const [userRes, userRepoRes] = await Promise.all([
            fetch(userAPI),
            fetch(userRepoAPI)
        ]);

        // Agar user na mile
        if (!userRes.ok) {
            profile.innerHTML = "<h3>User Not Found ❌</h3>";
            return;
        }

        // Data conversion
        userProfile = await userRes.json();
        userRepos = await userRepoRes.json();

        console.log("User Data:", userProfile);

        displayProfile(); // Card banao
        displayRepo();    // List banao
        
    } catch (error) {
        console.log("Error:", error);
        profile.innerHTML = "<h3>Something went wrong! ⚠️</h3>";
    }
}



// --- 5. Display Functions (UI Banana) ---

function displayProfile() {
    profile.innerHTML = `
        <div class="card">
            <div>
                <img src="${userProfile.avatar_url}" alt="${userProfile.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${userProfile.name}</h2>
                <p>${userProfile.bio ? userProfile.bio : 'No Bio Available'}</p>
                
                <ul class="info">
                    <li>${userProfile.followers} <strong>Followers</strong></li>
                    <li>${userProfile.following} <strong>Following</strong></li>
                    <li>${userProfile.public_repos} <strong>Repos</strong></li>
                </ul>
            </div>
        </div>
    `;
}

function displayRepo() {
    repo.innerHTML = ""; // Purana data saaf
    
    // Top 5 repos dikhayenge
    userRepos.slice(0, 5).forEach((project) => {
        const link = document.createElement('a');
        link.classList.add('repo');
        link.href = project.html_url;
        link.innerText = project.name;
        link.target = "_blank";
        
        repo.appendChild(link);
    });
}

// --- 3. Button Click Event (Aakhri me) ---
searchBtn.addEventListener('click', () => {
    const inputName = search.value;

    if (inputName !== "") {
        // Ab function ko bulao
        getGitHubUsersData(inputName);
    } else {
        alert("Please enter a username!");
    }
});

search.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});