document.addEventListener('DOMContentLoaded', () => {
    console.log('Umumiy script yuklandi!');

    // SIGN IN SAHIFA LOGIKASI (signin.html uchun)
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        console.log('signin.html formasi topildi');
        signinForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (usernameInput && passwordInput) {
                const username = usernameInput.value;
                const password = passwordInput.value;

                try {
                    const response = await fetch('http://13.60.5.226:5500/api/token/', { // Signin API manzili
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    const data = await response.json();

                    if (response.ok && data.access) { // Agar javob yaxshi bo'lsa va access token bo'lsa
                        localStorage.setItem('foydalanuvchi_nomi', username);
                        localStorage.setItem('accessToken', data.access); // Tokenni localStorage ga saqlash
                        window.location.href = 'dashboard.html'; // Dashboardga yo'naltirish
                    } else {
                        console.error('Kirishda xatolik:', data.message || 'Xatolik yuz berdi');
                        // Xatolik haqida foydalanuvchini ogohlantirish
                    }
                } catch (error) {
                    console.error('Kirish so\'rovida xatolik:', error);
                    // Tarmoq xatoligi haqida foydalanuvchini ogohlantirish
                }
            }
        });
    } else {
        console.log('signin.html formasi topilmadi.');
    }

    // DASHBOARD SAHIFA LOGIKASI (dashboard.html uchun)
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const statisticTable = document.getElementById('statistic-table');
    const lineChartDashboard1Canvas = document.getElementById('lineChartDashboard1');
    const lineChartDashboard2Canvas = document.getElementById('lineChartDashboard2');

    if (usernameDisplay) {
        const username = localStorage.getItem('foydalanuvchi_nomi');
        if (username) {
            usernameDisplay.textContent = `Salom, ${username}!`;
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('foydalanuvchi_nomi');
            localStorage.removeItem('accessToken'); // Tokenni ham o'chiramiz
            window.location.href = '../pages/signin.html';
        });
    }

    if (statisticTable) {
        loadStatistics();
    }

    function loadStatistics() {
        const token = localStorage.getItem('accessToken'); // Tokenni olish
        fetch('http://13.60.5.226:5500/api/api_2/statistics/', { // Statistikalar API manzili
            headers: {
                'Authorization': `Bearer ${token}`, // Tokenni headerga qo'shish
            },
        })
            .then(response => response.json())
            .then(data => displayStatistics(data))
            .catch(error => console.error('Statistikalarni olishda xatolik (Loyiha 1):', error));
    }

    function displayStatistics(statistics) {
        const tbody = document.getElementById('statistic-body');
        if (tbody) {
            tbody.innerHTML = '';
            statistics.forEach(statistic => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${statistic.title}</td>
                    <td>${statistic.value}</td>
                    <td>${statistic.timestamp}</td>
                `;
            });
        }
    }

    // Line graphlarni yaratish uchun funksiyalar
    function createLineChart(canvas, data, label, color) {
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: label,
                    data: data.values,
                    borderColor: color,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Backenddan grafik ma'lumotlarini olish (misol)
    function loadDashboardChartData() {
        const token = localStorage.getItem('accessToken');

        // 1-grafik uchun ma'lumotlarni olish
        fetch('YOUR_CHART1_API_ENDPOINT_DASHBOARD', { // 1-grafik API manzili (dashboard)
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            createLineChart(lineChartDashboard1Canvas, data, 'Grafik 1', 'blue');
        })
        .catch(error => console.error('Dashboard Grafik 1 ma\'lumotlarini olishda xatolik:', error));

        // 2-grafik uchun ma'lumotlarni olish
        fetch('YOUR_CHART2_API_ENDPOINT_DASHBOARD', { // 2-grafik API manzili (dashboard)
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            createLineChart(lineChartDashboard2Canvas, data, 'Grafik 2', 'green');
        })
        .catch(error => console.error('Dashboard Grafik 2 ma\'lumotlarini olishda xatolik:', error));
    }

    // Grafik ma'lumotlarini yuklashni chaqirish
    if (lineChartDashboard1Canvas && lineChartDashboard2Canvas) {
        loadDashboardChartData();
    }

    // CRUD SAHIFA LOGIKASI (crud.html uchun)
    const itemTable = document.getElementById('data-table');
    const crudForm = document.getElementById('crud-form');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const idInput = document.getElementById('id');
    const cancelEditBtn = document.getElementById('cancel-edit');

    if (itemTable) {
        loadItems();
    }

    if (crudForm) {
        crudForm.addEventListener('submit', saveItem);
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', clearForm);
    }

    function loadItems() {
        const token = localStorage.getItem('accessToken');
        fetch('http://13.60.5.226:5500/api/api_1/items/', { // Elementlar API manzili
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => displayItems(data))
            .catch(error => console.error('Elementlarni olishda xatolik (Loyiha 1):', error));
    }

    function displayItems(items) {
        const tbody = document.getElementById('data-body');
        if (tbody) {
            tbody.innerHTML = '';
            items.forEach(item => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>
                        <button onclick="window.editItem(${item.id})">Tahrirlash</button>
                        <button onclick="window.deleteItem(${item.id})">O'chirish</button>
                    </td>
                `;
            });
        }
    }

    async function saveItem(event) {
        event.preventDefault();
        if (nameInput && descriptionInput && idInput) {
            const name = nameInput.value;
            const description = descriptionInput.value;
            const id = idInput.value;

            const itemData = { name: name, description: description };
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://13.60.5.226:5500/api/api_1/items/${id}/` : 'http://13.60.5.226:5500/api/api_1/items/'; // Elementlar API manzili (bitta element)
            const token = localStorage.getItem('accessToken');

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(itemData),
                });
                const data = await response.json();
                loadItems();
                clearForm();
            } catch (error) {
                console.error('Elementni saqlashda xatolik (Loyiha 1):', error);
            }
        }
    }

    window.editItem = function(id) {
        const token = localStorage.getItem('accessToken');
        fetch(`http://13.60.5.226:5500/api/api_1/items/${id}/`, { // Elementlar API manzili (bitta element)
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(item => {
                if (nameInput && descriptionInput && idInput) {
                    idInput.value = item.id;
                    nameInput.value = item.name;
                    descriptionInput.value = item.description;
                    if (cancelEditBtn) {
                        cancelEditBtn.style.display = 'inline';
                    }
                }
            })
            .catch(error => console.error('Elementni olishda xatolik (Loyiha 1):', error));
    };

    window.deleteItem = function(id) {
        if (confirm('Elementni o\'chirishga ishonchingiz komilmi?')) {
            const token = localStorage.getItem('accessToken');
            fetch(`http://13.60.5.226:5500/api/api_1/items/${id}/`, { // Elementlar API manzili (bitta element)
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(() => loadItems())
                .catch(error => console.error('Elementni o\'chirishda xatolik (Loyiha 1):', error));
        }
    };

    function clearForm() {
        if (crudForm && nameInput && descriptionInput && idInput && cancelEditBtn) {
            crudForm.reset();
            idInput.value = '';
            cancelEditBtn.style.display = 'none';
        }
    }
});