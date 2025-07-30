
let pages = [];
let currentIndex = 0;

function generatePage() {
  const prompt = document.getElementById("prompt").value;
  if (!prompt) return alert("Enter a prompt");

  const page = document.createElement("div");
  page.className = "page";
  page.innerText = "Generating...";
  document.getElementById("comic-pages").appendChild(page);

  fetch("https://your-backend-url.com/generate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  .then(res => res.json())
  .then(data => {
    page.innerHTML = \`<img src="\${data.image}" alt="Comic Page" />\`;
    pages.push(page);
    updateView();
  })
  .catch(err => {
    page.innerText = "❌ Failed to generate.";
    console.error(err);
  });
}

function updateView() {
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(p => p.classList.remove('active'));
  if (pages[currentIndex]) pages[currentIndex].classList.add('active');
}

function goNext() {
  if (currentIndex < pages.length - 1) {
    currentIndex++;
    updateView();
  }
}

function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    updateView();
  }
}

function payWithPaystack() {
  var handler = PaystackPop.setup({
    key: 'pk_test_aada79f897629222d7b87eb9f01ac0d9674eda1d',
    email: 'test@user.com',
    amount: 200000,
    currency: "NGN",
    callback: function(response){
      alert('Payment successful! You can now export.');
      document.getElementById('exportBtn').disabled = false;
    },
    onClose: function(){
      alert('Payment window closed');
    }
  });
  handler.openIframe();
}

function exportPDF() {
  const doc = new jspdf.jsPDF();
  const pagesContainer = document.getElementById("comic-pages");

  html2canvas(pagesContainer).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save("buforge_comic_book.pdf");
  });
}
