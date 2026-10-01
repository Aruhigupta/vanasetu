# Contract ABI for HerbChainTraceability.sol

HERBCHAIN_CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": False,
		"inputs": [
			{"indexed": True, "internalType": "string", "name": "batchId", "type": "string"},
			{"indexed": False, "internalType": "string", "name": "herbType", "type": "string"},
			{"indexed": True, "internalType": "address", "name": "farmer", "type": "address"},
			{"indexed": False, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
		],
		"name": "HerbRegistered",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{"indexed": True, "internalType": "string", "name": "batchId", "type": "string"},
			{"indexed": False, "internalType": "bool", "name": "approved", "type": "bool"},
			{"indexed": False, "internalType": "string", "name": "labCertIpfsHash", "type": "string"}
		],
		"name": "LabReportAdded",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{"indexed": True, "internalType": "string", "name": "batchId", "type": "string"},
			{"indexed": False, "internalType": "string", "name": "medicineName", "type": "string"},
			{"indexed": False, "internalType": "string", "name": "finalProductHash", "type": "string"}
		],
		"name": "ManufacturingCompleted",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{"indexed": True, "internalType": "string", "name": "batchId", "type": "string"},
			{"indexed": False, "internalType": "enum HerbChainTraceability.BatchStatus", "name": "status", "type": "uint8"}
		],
		"name": "StatusChanged",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{"indexed": True, "internalType": "string", "name": "batchId", "type": "string"},
			{"indexed": False, "internalType": "string", "name": "location", "type": "string"},
			{"indexed": False, "internalType": "int256", "name": "temperature", "type": "int256"}
		],
		"name": "TransportUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{"internalType": "string", "name": "_batchId", "type": "string"},
			{"internalType": "string", "name": "_labCertIpfsHash", "type": "string"},
			{"internalType": "string", "name": "_chemicalAssayDetails", "type": "string"},
			{"internalType": "bool", "name": "_heavyMetalsPassed", "type": "bool"},
			{"internalType": "bool", "name": "_pesticidesPassed", "type": "bool"},
			{"internalType": "uint256", "name": "_activePotencyPercentage", "type": "uint256"},
			{"internalType": "bool", "name": "_overallApproved", "type": "bool"}
		],
		"name": "addLabReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"name": "allBatchIds",
		"outputs": [
			{"internalType": "string", "name": "", "type": "string"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "string", "name": "_batchId", "type": "string"}
		],
		"name": "getBatchDetails",
		"outputs": [
			{"internalType": "enum HerbChainTraceability.BatchStatus", "name": "status", "type": "uint8"},
			{
				"components": [
					{"internalType": "string", "name": "batchId", "type": "string"},
					{"internalType": "string", "name": "herbType", "type": "string"},
					{"internalType": "string", "name": "botanicalName", "type": "string"},
					{"internalType": "address", "name": "registeredBy", "type": "address"},
					{"internalType": "string", "name": "farmLocation", "type": "string"},
					{"internalType": "string", "name": "gpsCoordinates", "type": "string"},
					{"internalType": "uint256", "name": "harvestTimestamp", "type": "uint256"},
					{"internalType": "uint256", "name": "quantityKg", "type": "uint256"},
					{"internalType": "string", "name": "imageIpfsHash", "type": "string"},
					{"internalType": "uint256", "name": "moisturePercentage", "type": "uint256"}
				],
				"internalType": "struct HerbChainTraceability.CollectionRecord",
				"name": "collection",
				"type": "tuple"
			},
			{
				"components": [
					{"internalType": "string", "name": "labCertIpfsHash", "type": "string"},
					{"internalType": "string", "name": "chemicalAssayDetails", "type": "string"},
					{"internalType": "bool", "name": "heavyMetalsPassed", "type": "bool"},
					{"internalType": "bool", "name": "pesticidesPassed", "type": "bool"},
					{"internalType": "uint256", "name": "activePotencyPercentage", "type": "uint256"},
					{"internalType": "bool", "name": "overallApproved", "type": "bool"},
					{"internalType": "uint256", "name": "testedTimestamp", "type": "uint256"},
					{"internalType": "address", "name": "labAddress", "type": "address"}
				],
				"internalType": "struct HerbChainTraceability.LabTestRecord",
				"name": "labTest",
				"type": "tuple"
			},
			{
				"components": [
					{"internalType": "string", "name": "carrierName", "type": "string"},
					{"internalType": "string", "name": "vehicleId", "type": "string"},
					{"internalType": "string", "name": "currentGpsLocation", "type": "string"},
					{"internalType": "int256", "name": "temperatureCelsius", "type": "int256"},
					{"internalType": "uint256", "name": "humidityPercentage", "type": "uint256"},
					{"internalType": "uint256", "name": "updatedTimestamp", "type": "uint256"}
				],
				"internalType": "struct HerbChainTraceability.TransportRecord",
				"name": "transport",
				"type": "tuple"
			},
			{"internalType": "string", "name": "facility", "type": "string"},
			{"internalType": "string", "name": "medicineName", "type": "string"},
			{"internalType": "string", "name": "finalIpfsHash", "type": "string"},
			{"internalType": "uint256", "name": "createdBlock", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalBatchesCount",
		"outputs": [
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{"internalType": "address", "name": "", "type": "address"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "string", "name": "_batchId", "type": "string"},
			{"internalType": "string", "name": "_herbType", "type": "string"},
			{"internalType": "string", "name": "_botanicalName", "type": "string"},
			{"internalType": "string", "name": "_farmLocation", "type": "string"},
			{"internalType": "string", "name": "_gpsCoordinates", "type": "string"},
			{"internalType": "uint256", "name": "_quantityKg", "type": "uint256"},
			{"internalType": "string", "name": "_imageIpfsHash", "type": "string"},
			{"internalType": "uint256", "name": "_moisturePercentage", "type": "uint256"}
		],
		"name": "registerHerb",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "string", "name": "_batchId", "type": "string"},
			{"internalType": "string", "name": "_facilityName", "type": "string"},
			{"internalType": "string", "name": "_medicineName", "type": "string"},
			{"internalType": "string", "name": "_finalProductIpfsHash", "type": "string"}
		],
		"name": "updateManufacturing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "string", "name": "_batchId", "type": "string"},
			{"internalType": "string", "name": "_carrierName", "type": "string"},
			{"internalType": "string", "name": "_vehicleId", "type": "string"},
			{"internalType": "string", "name": "_currentGpsLocation", "type": "string"},
			{"internalType": "int256", "name": "_temperatureCelsius", "type": "int256"},
			{"internalType": "uint256", "name": "_humidityPercentage", "type": "uint256"}
		],
		"name": "updateTransportStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
