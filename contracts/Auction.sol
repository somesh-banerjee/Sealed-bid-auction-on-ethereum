pragma solidity ^0.8.0;

contract Auction {
    struct participant{
        uint bid;
        bool placedbid;
        bytes32 encryptbid;
        bool revealedbid;
    }
    bool auctioning;
    uint public buyers_count;
    address public topbidder;
    uint public topbid;
    uint public baseprice;
    address public auctioner;
    mapping(address => participant) public participants;

    modifier restricted() {
        require(msg.sender == auctioner);
        _;
    }

    constructor(uint bp) {
        auctioner = msg.sender;
        buyers_count = 0;
        topbid = 0;
        auctioning = true;
        baseprice = bp;
    }

    function placeBid(bytes32 enc_msg) public {
        require(auctioning);
        require(!participants[msg.sender].placedbid);
        participants[msg.sender].encryptbid = enc_msg;
        participants[msg.sender].placedbid = true;
        buyers_count++;
    }

    function closeAuction() public restricted{
        auctioning = false;
    }

    function revealBids(string memory key, uint bid, string memory company) public{
        require(!auctioning);
        require(participants[msg.sender].placedbid);
        require(!participants[msg.sender].revealedbid);
        string memory sn = uint2str(bid);
        string memory str = string(abi.encodePacked(key, sn, company));
        bytes32 hash = keccak256(abi.encodePacked(str));
        if(hash == participants[msg.sender].encryptbid){
            participants[msg.sender].bid = bid;
            participants[msg.sender].revealedbid = true;
        }
        if(participants[msg.sender].bid >= baseprice){
            if(participants[msg.sender].bid > topbid){
                topbid = participants[msg.sender].bid;
                topbidder = msg.sender;
            }
        }
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }    
}
