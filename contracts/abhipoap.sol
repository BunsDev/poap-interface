//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract abhipoap is ERC721A, Ownable, ReentrancyGuard {
    // address owner;
    uint256 public currentSupply = 1;
    uint256 public maxSupply = 200;
    bool public publicMintActive = false;
    bool public burnProfileActive = false;
    string public baseURI;
    event Attest(address indexed to, uint256 _tokenId);
    event Revoke(address indexed to, uint256 _tokenId);
    event NewNFTMinted(address sender, uint256 tokenId, string tokenURI);

    constructor() ERC721A("Pillai Learn Web3 ", "LW3") {
        console.log("This is Proof of Attendence for Pillai Learn Web3 event");
    }

    //get tokenURI with baseURI and tokenId
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string memory _CurrbaseURI = _baseURI();
        return _CurrbaseURI;
    }

    //base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function mintTrutsNFT(address toAddress) public onlyOwner {
        //uncoment the require later
        require(balanceOf(toAddress) < 2, "Max limit is only one per User");
        require(publicMintActive, "Wait for the party to start");
        require(currentSupply + 1 <= maxSupply);
        uint256 itemId = currentSupply;
        uint256 quantity = 1;

        _safeMint(toAddress, quantity);

        emit NewNFTMinted(toAddress, itemId, tokenURI(itemId));
        currentSupply++;
        console.log("An NFT w/ ID %s has been minted to %s", itemId, toAddress);
    }

    //when user deletes the profile
    function burnToken(uint256 tokenId) external {
        require(burnProfileActive, "Wait for your profile probation to end");
        require(
            ownerOf(tokenId) == msg.sender,
            "Yoo, you are not the owner of the token."
        );
        _burn(tokenId);
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal override(ERC721A) {
        require(
            from == address(0) || to == address(0),
            "You cant transfer this token"
        );
    }

    function _afterTokenTransfers(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal override {
        if (from == address(0)) {
            emit Attest(to, tokenId);
        }
        if (to == address(0)) {
            emit Revoke(to, tokenId);
        }
    }

    //Setting burn profile active, this can be timely done
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
    }

    function setPublicMintActive(bool _publicMintActive) external onlyOwner {
        publicMintActive = _publicMintActive;
    }
}
