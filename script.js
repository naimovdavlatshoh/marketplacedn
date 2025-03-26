// Parametrlar
let currentPage = 1;
const limit = 2;

// Ma'lumot olish funksiyasi
async function getData(page = 1) {
    const skip = (page - 1) * limit;
    const url = `http://45.147.177.211:8000/all/product/?skip=${skip}&limit=${limit}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Xatolik:", error);
        return [];
    }
}

// Cardlarni yaratadigan funksiya
function renderCards(data) {
    const container = document.querySelector(".cards-container");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p>Hech qanday node topilmadi.</p>`;
        return;
    }

    data.forEach((item) => {
        // Card div yaratish
        const card = document.createElement("div");
        card.classList.add("card");

        // Image yaratish
        const img = document.createElement("img");
        img.src = item.image || item.image_url || "./default-img.png";
        img.alt = item.title || "DK Node";

        // Card content div
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        // Title yaratish
        const title = document.createElement("h3");
        title.textContent = item.title || item.name;

        // Content containerga qo'shish
        cardContent.appendChild(title);

        // Card containerga qo'shish
        card.appendChild(img);
        card.appendChild(cardContent);

        // Card bosilganda modal ochish
        card.addEventListener("click", () => openModal(item));

        container.appendChild(card);
    });
}

// Modal yaratish
const modal = document.createElement("div");
modal.classList.add("modal");
modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <img id="modal-img" src="" alt="">
        <h3 id="modal-title"></h3>
        <p id="modal-price"></p>
        <button id="modal-add-to-cart">Add to Cart</button>
    </div>
`;
document.body.appendChild(modal);

// Modalni ochish funksiyasi
function openModal(item) {
    document.getElementById("modal-title").textContent =
        item.name || item.title;
    document.getElementById("modal-img").src =
        item.image_url || item.image || "";
    document.getElementById("modal-price").textContent = `Monthly - $${
        item.price || "0.00"
    }`;

    const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
    modalAddToCartBtn.onclick = async () => {
        try {
            const response = await fetch(
                `http://45.147.177.211:8000/cart/add?product_id=${item.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "auth_token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                alert(`${item.title || item.name} savatga qo'shildi!`);
            } else {
                alert("Xatolik yuz berdi, qaytadan urinib ko'ring.");
            }
        } catch (error) {
            console.error("Xatolik:", error);
            alert("Serverga ulanishda muammo yuz berdi.");
        }
    };

    modal.style.display = "flex";
}

// Modalni yopish funksiyasi
document.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
});

// Modal tashqarisini bosganda yopish
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Pagination tugmalari
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        updateCards();
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    updateCards();
});

// Kartalarni va paginationni update qiladigan funksiya
function updateCards() {
    getData(currentPage).then((result) => {
        console.log("Olingan data:", result);
        renderCards(result);
    });
}

updateCards();
