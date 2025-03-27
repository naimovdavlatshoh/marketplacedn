// Parametrlar
let currentPage = 1;
const limit = 2;

// Ma'lumot olish funksiyasi
async function getData(page = 1) {
    const skip = (page - 1) * limit;
    const url = `https://api.cardeurope.ru/all/product/?skip=${skip}&limit=${limit}`;

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

        const button = document.createElement("button");
        button.classList.add("price-btn");
        button.innerHTML = `Monthly $${item.price}` || "0.00";

        // Content containerga qo'shish
        cardContent.appendChild(title);
        cardContent.appendChild(button);

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
        <h3 id="modal-desc"></h3>
        <img id="modal-img" src="" alt="">
        <h3 id="modal-title"></h3>
        <p id="modal-price"></p>
        <button id="modal-add-to-cart"></button>
    </div>
`;
document.body.appendChild(modal);

// Modalni ochish funksiyasi
function openModal(item) {
    document.getElementById("modal-title").textContent =
        item.name || item.title;
    document.getElementById("modal-desc").textContent =
        item.description || item.title;
    document.getElementById("modal-img").src =
        item.image_url || item.image || "";
    document.getElementById("modal-add-to-cart").textContent = `Add to Cart $${
        item.price || "0.00"
    }`;

    const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
    modalAddToCartBtn.onclick = async () => {
        try {
            const response = await fetch(
                `https://api.cardeurope.ru/cart/add?product_id=${item.id}`,
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
                alert(`${item.title || item.name} added to cart`);
            } else {
                alert("Something went wrong! Please try again.");
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
