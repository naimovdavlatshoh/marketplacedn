document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("cartModal_");
    const cartBtn = document.querySelector(".cart-btn");
    const closeModal = document.querySelector(".close_");

    // Modalni ochish
    cartBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    // Modalni yopish
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Modalni fondga bosganda yopish
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
