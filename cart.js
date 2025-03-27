document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("cartModal_");
    const closeModal = document.querySelector(".close_");
    const cartBtn = document.querySelector(".cart-btn_");
    const cartItemsContainer = document.querySelector(".cart-items-container_");
    const cartTotal = document.getElementById("cart-total_");

    // Modalni ochish
    cartBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        fetchCartData();
    });

    // Modalni yopish
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Modalni tashqariga bosganda yopish
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Backenddan ma'lumot olish
    async function fetchCartData() {
        try {
            const response = await fetch("https://api.cardeurope.ru/cart", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Serverdan xatolik keldi");
            }

            const data = await response.json();
            console.log(data);

            cartItemsContainer.innerHTML = "";

            let totalAmount = 0;

            data.cart.forEach((item) => {
                totalAmount += item.product.price;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item_");
                cartItem.innerHTML = `
                    <span class="item-name_">${item.product.name}</span>
                    <div>
                        <span class="item-price_">$${item.product.price} x 1</span>
                        <button class="remove-btn_" data-id="${item.id}">✖</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Umumiy summani yangilash
            cartTotal.textContent = `$${totalAmount.toFixed(2)}`;

            // Yangi remove tugmalari uchun event qo'shish
            document.querySelectorAll(".remove-btn_").forEach((button) => {
                button.addEventListener("click", function () {
                    const itemId = this.getAttribute("data-id");
                    removeCartItem(itemId);
                });
            });
        } catch (error) {
            console.error("Savatni yuklashda xatolik:", error);
        }
    }

    // Elementni o‘chirish funksiyasi
    async function removeCartItem(itemId) {
        try {
            await fetch(`https://api.cardeurope.ru/cart/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer 067bb57013621c6edc40af0d98d0ff39`,
                },
            });
            fetchCartData(); // O‘chirgandan keyin yangilash
        } catch (error) {
            console.error("Elementni o‘chirishda xatolik:", error);
        }
    }
});

fetchCartData();
