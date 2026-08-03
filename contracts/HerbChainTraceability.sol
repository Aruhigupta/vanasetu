// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HerbChainTraceability
 * @dev Smart Contract for Botanical Herb Traceability & AYUSH Compliance on Polygon Blockchain.
 * Enforces immutable records for Farmer Collections, Lab Reports, Transport Checks, and Final Product Batches.
 */
contract HerbChainTraceability {
    address public owner;

    enum BatchStatus { Registered, Collected, TestedPassed, TestedFailed, InTransit, Manufactured, Dispatched }

    struct CollectionRecord {
        string batchId;
        string herbType;
        string botanicalName;
        address registeredBy;
        string farmLocation;
        string gpsCoordinates;
        uint256 harvestTimestamp;
        uint256 quantityKg;
        string imageIpfsHash;
        uint256 moisturePercentage;
    }

    struct LabTestRecord {
        string labCertIpfsHash;
        string chemicalAssayDetails;
        bool heavyMetalsPassed;
        bool pesticidesPassed;
        uint256 activePotencyPercentage; // e.g. 85 for 8.5%
        bool overallApproved;
        uint256 testedTimestamp;
        address labAddress;
    }

    struct TransportRecord {
        string carrierName;
        string vehicleId;
        string currentGpsLocation;
        int256 temperatureCelsius;
        uint256 humidityPercentage;
        uint256 updatedTimestamp;
    }

    struct Batch {
        string batchId;
        CollectionRecord collection;
        LabTestRecord labTest;
        TransportRecord transport;
        string manufacturingFacility;
        string finalMedicineName;
        string finalProductIpfsHash;
        BatchStatus status;
        bool exists;
        uint256 createdBlock;
    }

    mapping(string => Batch) private batches;
    string[] public allBatchIds;

    // Events
    event HerbRegistered(string indexed batchId, string herbType, address indexed farmer, uint256 timestamp);
    event LabReportAdded(string indexed batchId, bool approved, string labCertIpfsHash);
    event TransportUpdated(string indexed batchId, string location, int256 temperature);
    event ManufacturingCompleted(string indexed batchId, string medicineName, string finalProductHash);
    event StatusChanged(string indexed batchId, BatchStatus status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute this");
        _;
    }

    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].exists, "Batch ID does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Step 1: Register initial herb harvest/collection record
     */
    function registerHerb(
        string memory _batchId,
        string memory _herbType,
        string memory _botanicalName,
        string memory _farmLocation,
        string memory _gpsCoordinates,
        uint256 _quantityKg,
        string memory _imageIpfsHash,
        uint256 _moisturePercentage
    ) external {
        require(!batches[_batchId].exists, "Batch already registered");

        Batch storage newBatch = batches[_batchId];
        newBatch.batchId = _batchId;
        newBatch.exists = true;
        newBatch.status = BatchStatus.Collected;
        newBatch.createdBlock = block.number;

        newBatch.collection = CollectionRecord({
            batchId: _batchId,
            herbType: _herbType,
            botanicalName: _botanicalName,
            registeredBy: msg.sender,
            farmLocation: _farmLocation,
            gpsCoordinates: _gpsCoordinates,
            harvestTimestamp: block.timestamp,
            quantityKg: _quantityKg,
            imageIpfsHash: _imageIpfsHash,
            moisturePercentage: _moisturePercentage
        });

        allBatchIds.push(_batchId);
        emit HerbRegistered(_batchId, _herbType, msg.sender, block.timestamp);
    }

    /**
     * @dev Step 2: Add certified Lab Test results
     */
    function addLabReport(
        string memory _batchId,
        string memory _labCertIpfsHash,
        string memory _chemicalAssayDetails,
        bool _heavyMetalsPassed,
        bool _pesticidesPassed,
        uint256 _activePotencyPercentage,
        bool _overallApproved
    ) external batchExists(_batchId) {
        Batch storage b = batches[_batchId];

        b.labTest = LabTestRecord({
            labCertIpfsHash: _labCertIpfsHash,
            chemicalAssayDetails: _chemicalAssayDetails,
            heavyMetalsPassed: _heavyMetalsPassed,
            pesticidesPassed: _pesticidesPassed,
            activePotencyPercentage: _activePotencyPercentage,
            overallApproved: _overallApproved,
            testedTimestamp: block.timestamp,
            labAddress: msg.sender
        });

        b.status = _overallApproved ? BatchStatus.TestedPassed : BatchStatus.TestedFailed;

        emit LabReportAdded(_batchId, _overallApproved, _labCertIpfsHash);
        emit StatusChanged(_batchId, b.status);
    }

    /**
     * @dev Step 3: Update cold-chain transport telemetry & GPS checkpoint
     */
    function updateTransportStatus(
        string memory _batchId,
        string memory _carrierName,
        string memory _vehicleId,
        string memory _currentGpsLocation,
        int256 _temperatureCelsius,
        uint256 _humidityPercentage
    ) external batchExists(_batchId) {
        Batch storage b = batches[_batchId];

        b.transport = TransportRecord({
            carrierName: _carrierName,
            vehicleId: _vehicleId,
            currentGpsLocation: _currentGpsLocation,
            temperatureCelsius: _temperatureCelsius,
            humidityPercentage: _humidityPercentage,
            updatedTimestamp: block.timestamp
        });

        b.status = BatchStatus.InTransit;

        emit TransportUpdated(_batchId, _currentGpsLocation, _temperatureCelsius);
        emit StatusChanged(_batchId, b.status);
    }

    /**
     * @dev Step 4: Record Manufacturing & final medicine output batch
     */
    function updateManufacturing(
        string memory _batchId,
        string memory _facilityName,
        string memory _medicineName,
        string memory _finalProductIpfsHash
    ) external batchExists(_batchId) {
        Batch storage b = batches[_batchId];

        b.manufacturingFacility = _facilityName;
        b.finalMedicineName = _medicineName;
        b.finalProductIpfsHash = _finalProductIpfsHash;
        b.status = BatchStatus.Manufactured;

        emit ManufacturingCompleted(_batchId, _medicineName, _finalProductIpfsHash);
        emit StatusChanged(_batchId, b.status);
    }

    /**
     * @dev Public Verification: Fetch full batch lifecycle & blockchain authenticity
     */
    function getBatchDetails(string memory _batchId)
        external
        view
        batchExists(_batchId)
        returns (
            BatchStatus status,
            CollectionRecord memory collection,
            LabTestRecord memory labTest,
            TransportRecord memory transport,
            string memory facility,
            string memory medicineName,
            string memory finalIpfsHash,
            uint256 createdBlock
        )
    {
        Batch storage b = batches[_batchId];
        return (
            b.status,
            b.collection,
            b.labTest,
            b.transport,
            b.manufacturingFacility,
            b.finalMedicineName,
            b.finalProductIpfsHash,
            b.createdBlock
        );
    }

    function getTotalBatchesCount() external view returns (uint256) {
        return allBatchIds.length;
    }
}
