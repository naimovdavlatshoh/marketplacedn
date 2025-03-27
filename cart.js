document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("cartModal_");
    const closeModal = document.querySelector(".close_");
    const cartBtn = document.querySelector(".cart-btn_"); // Tugma qo'shish kerak
    const removeBtn = document.querySelector(".remove-btn_");

    // Modalni ochish
    cartBtn.addEventListener("click", function () {
        modal.style.display = "flex";
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

    // Savatdagi elementni o‘chirish
    removeBtn.addEventListener("click", function () {
        document.querySelector(".cart-item_").style.display = "none";
    });
});
