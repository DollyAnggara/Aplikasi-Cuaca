document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            // Tutup semua FAQ lain (opsional, jika ingin hanya satu terbuka)
            questions.forEach((q) => {
                if (q !== question) {
                    q.classList.remove("active");
                    q.nextElementSibling.classList.remove("show");
                }
            });

            // Toggle status aktif pada pertanyaan yang diklik
            question.classList.toggle("active");
            const answer = question.nextElementSibling;
            answer.classList.toggle("show");
        });
    });
});