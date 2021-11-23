document.addEventListener('click', async (event) => {
    const ele = event.target;
    if (ele.matches('#add-text-btn')) {
        await addText();
    } else if (ele.matches('#add-image-btn')) {
        addImage();
    } else if (ele.matches('#get-data-btn')) {
        getText();
    } else if (ele.matches('#get-image-btn')) {
        getImage();
    } 
}, false)

async function addText() {
    const textInput = document.getElementById('text-input');
    const { data }= await axios.post('/api/ipfs', { text: textInput.value });
    displayText(data);
}


async function addImage() {
    const imageInput = document.getElementById('image-input');
    const reader = new FileReader();

    reader.onloadend = async () => {
        const buff = buffer.Buffer(reader.result) // Convert data into buffer
        const { data } = await axios.post('/api/ipfs', { image: buff });
        displayText(data);
    }
    reader.readAsArrayBuffer(imageInput.files[0]);
}

async function getText() {
    const data = await getData();
    displayText(data);
}


async function getImage() {
    const data = await getData();
    displayImage(data);
}

async function getData() {
    const cid = getCid();
    const { data } = await axios.get(`/api/ipfs/${cid}`);

    return data;
}

function getCid() {
    const cidInput = document.getElementById('cid-input');
    return cidInput.value;
}

function displayText(text) {
    const data = document.getElementById('data-anchor');
    data.innerHTML = `<a> ${text} </a>`;
};

function displayImage(buffer) {
    const data = document.getElementById('data-anchor');
    data.innerHTML = `<img src="data:image/png;base64,${buffer}"></img>`;
}


