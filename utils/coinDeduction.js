export default async function deductTokens(web3, userAddress, tokenAmount) {
  if (!web3) throw new Error("Web3 is not initialized. Please ensure MetaMask is connected.");
  if (!userAddress) throw new Error("User address is not available.");
  if (!tokenAmount || tokenAmount <= 0) throw new Error("Invalid token amount.");

  const contractAddress = "0x20854e3f9231778a1f9515A5551872F161a1E3A2";
  const recipientAddress = "0xE71FFA255232891E81185A189D3c423E2694688C";

  const contractABI = [
    {
      inputs: [
        { internalType: "address", name: "_to", type: "address" },
        { internalType: "uint256", name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "success", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const tx = await contract.methods
      .transfer(recipientAddress, tokenAmount)
      .send({ from: userAddress });

    console.log("Transaction successful:", tx.transactionHash);

    const transactionDetails = {
      transactionHash: tx.transactionHash,
      userAddress,
      recipientAddress,
      tokenAmount,
      timestamp: new Date().toISOString(),
    };

    const existingTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    existingTransactions.push(transactionDetails);
    localStorage.setItem("transactions", JSON.stringify(existingTransactions));

    return tx.transactionHash;
  } catch (error) {
    console.error("Error during token transfer:", error);
    throw new Error(error.message || "Token transfer failed.");
  }
}