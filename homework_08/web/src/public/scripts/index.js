const volcano = require("../../utils/contract");
const { BigNumber, ethers, utils } = require("ethers");

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
    } else if (ele.matches('#mint-btn')) {
        mintNFT();
    } else if (ele.matches('#get-nft-btn')) {
        getNFT();
    } else if (ele.matches('#transfer')) {
        transfer();
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

function displayText(text, element = 'data-anchor') {
    const data = document.getElementById(element);
    data.innerHTML = `<a> ${text} </a>`;
};



function displayImage(buffer) {
    const data = document.getElementById('data-anchor');
    data.innerHTML = `<img src="data:image/png;base64,${buffer}"></img>`;
}

async function mintNFT() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(volcano.address, volcano.abi, signer);

    const tokenURI = document.getElementById('mint-data');
    const owner = document.getElementById('mint-owner');
    const mint = await contract.mint(owner.value, tokenURI.value)
    const receipt = await mint.wait();
    displayText(JSON.stringify(receipt), 'data-nft-anchor');
}

async function getNFT() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(volcano.address, volcano.abi, signer);

    const address = document.getElementById('get-nft-address');
    const nfts = await contract.accountTokens(address.value)
    const nftsFormatted = nfts.map(nft => { 
        return { tokenURI: nft["tokenURI"], id: Number(nft["tokenId"]) }
    })
    displayText(JSON.stringify(nftsFormatted), 'data-nft-anchor');
}


async function transfer() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(volcano.address, volcano.abi, signer);

    const to = document.getElementById('to');
    const id = document.getElementById('id');

    const transfer = await contract._transfer(utils.getAddress(to.value), BigNumber.from(id.value))
    const transfered = await transfer.wait();
    displayText(JSON.stringify(transfered), 'data-nft-anchor');
}
