import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingContracts, buyoutContractAction, renegotiateContractAction } from "../../features/contract/contractSlice";

const ContractManagement = () => {
  const dispatch = useDispatch();
  const { contracts, loading, error } = useSelector((state) => state.contract || { contracts: [] });
  const [selectedContract, setSelectedContract] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const [newBackend, setNewBackend] = useState("");

  useEffect(() => {
    dispatch(fetchPendingContracts());
  }, [dispatch]);

  const handleBuyout = (contractId) => {
    if (window.confirm("Are you sure you want to trigger a contract buyout?")) {
      dispatch(buyoutContractAction(contractId));
    }
  };

  const handleRenegotiateSubmit = (e) => {
    e.preventDefault();
    if (!selectedContract) return;
    dispatch(
      renegotiateContractAction({
        contractId: selectedContract._id,
        newOffer: {
          baseSalary: Number(newSalary),
          backendPoints: Number(newBackend),
        },
      })
    );
    setSelectedContract(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Talent Contract Management</h1>
      {loading && <p>Loading contracts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contracts.map((contract) => (
          <div key={contract._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold text-lg">{contract.talentName || "Talent Deal"}</h3>
            <p className="text-sm text-gray-600">Role: {contract.talentRole || contract.talentType}</p>
            <p className="text-sm">Base Salary: ₹{(contract.offer?.baseSalary || contract.upfrontFee || 0).toLocaleString()}</p>
            <p className="text-sm">Backend Royalty: {contract.offer?.backendPoints || contract.backendRoyaltyPercentage || 0}%</p>
            <p className="text-sm">Status: <span className="font-semibold">{contract.status}</span></p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedContract(contract);
                  setNewSalary(contract.offer?.baseSalary || 100000);
                  setNewBackend(contract.offer?.backendPoints || 5);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Renegotiate
              </button>
              <button
                onClick={() => handleBuyout(contract._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Buyout
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Renegotiate Terms for {selectedContract.talentName}</h2>
            <form onSubmit={handleRenegotiateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">New Base Salary (₹)</label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">New Backend Royalty (%)</label>
                <input
                  type="number"
                  max="25"
                  value={newBackend}
                  onChange={(e) => setNewBackend(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  Confirm Renegotiation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;
