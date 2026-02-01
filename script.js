// --- Variables ---
const search = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const profile = document.getElementById('profile');
const repo = document.getElementById('repo');

// --- Main Function ---
async function githubUser(username) {
    const basePoint = "https://api.github.com/users/";
    const userAPI = basePoint + username;
    const userRepoAPI = basePoint + username + "/repos?sort=created";

    try {
        console.log("Searching starts for:", username);

        // Show loading
        profile.innerHTML = `
            <div class="card">
                <div class="loading">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #8b5cf6;"></i>
                    <h3>Loading Profile... ⏳</h3>
                </div>
            </div>
        `;
        repo.innerHTML = "";

        // API Call
        const [userResponse, userRepository] = await Promise.all([
            fetch(userAPI),
            fetch(userRepoAPI)
        ]);

        // If user not found
        if (!userResponse.ok) {
            profile.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
                    <h3>User Not Found ❌</h3>
                    <p style="color: #94a3b8; margin-top: 10px;">Please check the username and try again.</p>
                </div>
            `;
            return;
        }

        // Get data
        const userProfile = await userResponse.json();
        const userRepos = await userRepository.json();

        console.log("User Data:", userProfile);

        // Display profile
        profile.innerHTML = `
            <div class="card">
                <div>
                    <img src="${userProfile.avatar_url}" alt="${userProfile.name}" class="avatar">
                </div>
                <div class="user-info">
                    <h2>${userProfile.name || userProfile.login}</h2>
                    <p>${userProfile.bio || 'No bio available'}</p>
                    
                    <ul class="info">
                        <li>
                            <strong>${userProfile.followers}</strong>
                            <span>Followers</span>
                        </li>
                        <li>
                            <strong>${userProfile.following}</strong>
                            <span>Following</span>
                        </li>
                        <li>
                            <strong>${userProfile.public_repos}</strong>
                            <span>Repositories</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        // Display repositories
        displayRepo(userRepos);
        
    } catch (error) {
        console.log("Error:", error);
        profile.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <i class="fas fa-bug" style="font-size: 3rem; color: #f59e0b; margin-bottom: 20px;"></i>
                <h3>Something went wrong! ⚠️</h3>
                <p style="color: #94a3b8; margin-top: 10px;">Please check your connection and try again.</p>
            </div>
        `;
    }
}

// --- Display Repositories ---
function displayRepo(userRepos) {
    repo.innerHTML = "";
    
    // Create repos container
    const repoContainer = document.createElement('div');
    repoContainer.style.marginTop = '30px';
    
    // Add title
    const title = document.createElement('h3');
    title.innerHTML = `<i class="fas fa-code-branch"></i> Top Repositories (${userRepos.slice(0, 5).length})`;
    title.style.marginBottom = '20px';
    title.style.color = '#f8fafc';
    title.style.fontSize = '1.5rem';
    repoContainer.appendChild(title);
    
    // Add repos
    userRepos.slice(0, 5).forEach((project) => {
        const link = document.createElement('a');
        link.classList.add('repo');
        link.href = project.html_url;
        link.target = "_blank";
        
        // Add language indicator if available
        const langHTML = project.language ? 
            `<span style="font-size: 0.8rem; color: #94a3b8; margin-left: 10px;">
                <i class="fas fa-circle" style="color: ${getLanguageColor(project.language)}; font-size: 0.6rem;"></i>
                ${project.language}
            </span>` : '';
        
        link.innerHTML = `
            <i class="fas fa-book"></i> ${project.name}
            ${langHTML}
            <span style="font-size: 0.8rem; color: #94a3b8; margin-left: 10px;">
                <i class="fas fa-star"></i> ${project.stargazers_count}
            </span>
        `;
        
        repoContainer.appendChild(link);
    });
    
    repo.appendChild(repoContainer);
    
    // If no repos
    if (userRepos.length === 0) {
        const noRepos = document.createElement('p');
        noRepos.textContent = 'No repositories found.';
        noRepos.style.color = '#94a3b8';
        noRepos.style.textAlign = 'center';
        noRepos.style.padding = '20px';
        repo.appendChild(noRepos);
    }
}

// --- Simple language colors ---
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
    };
    return colors[language] || '#8b949e';
}

// --- Event Listeners ---
searchBtn.addEventListener('click', () => {
    const inputName = search.value.trim();
    if (inputName !== "") {
        githubUser(inputName);
    } else {
        // Simple alert (no extra notification system)
        alert("Please enter a GitHub username!");
        search.focus();
    }
});

search.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Optional: Focus on search input on page load
window.addEventListener('load', () => {
    search.focus();
});