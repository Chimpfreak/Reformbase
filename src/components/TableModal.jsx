import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const TableModal = ({ group, onClose }) => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [isEditingTableName, setIsEditingTableName] = useState(false);
  const [editedTableName, setEditedTableName] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`/data/${group._id}/tables`);
      if (Array.isArray(response.data.tables)) {
        setTables(response.data.tables);
      } else {
        console.error('Error: Data fetched is not an array');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleAddTable = async () => {
    try {
      await axios.post(`/data/${group._id}/tables`, { name: newTableName });
      setNewTableName('');
      fetchTables();
    } catch (error) {
      console.error('Error adding table:', error);
    }
  };

  const handleSelectTable = async (table) => {
    setSelectedTable(table);
    try {
      const response = await axios.get(`/data/${group._id}/tables/${table._id}`);
      setTableData(response.data.content);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const handleAddRow = async () => {
    try {
      const updatedTableData = [...tableData, newRow];
      setTableData(updatedTableData);

      await axios.put(`/data/${group._id}/tables/${selectedTable._id}`, {
        content: updatedTableData,
      });

      setNewRow({});
      fetchTables();
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const handleInputChange = (e, key) => {
    setNewRow({ ...newRow, [key]: e.target.value });
  };

  const handleEditTableName = (table) => {
    setEditedTableName(table.name);
    setIsEditingTableName(true);
    setSelectedTable(table);
  };

  const handleSaveTableName = async () => {
    try {
      await axios.put(`/data/${group._id}/tables/${selectedTable._id}`, {
        name: editedTableName,
      });
      setIsEditingTableName(false);
      fetchTables();
    } catch (error) {
      console.error('Error saving table name:', error);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await axios.delete(`/data/${group._id}/tables/${tableId}`);
      fetchTables();
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl mb-4">{group.name}</h2>
        <div className="mb-4">
          {tables.map((table) => (
            <div key={table._id} className="border rounded-lg p-4 bg-gray-50 mb-2">
              <div className="flex justify-between items-center">
                {isEditingTableName && selectedTable._id === table._id ? (
                  <input
                    type="text"
                    className="w-full"
                    value={editedTableName}
                    onChange={(e) => setEditedTableName(e.target.value)}
                    onBlur={handleSaveTableName}
                  />
                ) : (
                  <span onClick={() => handleSelectTable(table)} className="cursor-pointer">{table.name}</span>
                )}
                <div className="flex space-x-2">
                  <button onClick={() => handleEditTableName(table)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 hover:text-gray-700"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5l4 4L7 21l-4.5 1.5L5 17z"></path>
                    </svg>
                  </button>
                  <button onClick={() => handleDeleteTable(table._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 hover:text-gray-700"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    </svg>
                  </button>
                </div>
              </div>
              {selectedTable && selectedTable._id === table._id && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Table Data</h3>
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                          <th key={key} className="border px-4 py-2">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, idx) => (
                            <td key={idx} className="border px-4 py-2">{value}</td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                          <td key={key} className="border px-4 py-2">
                            <input
                              type="text"
                              className="w-full"
                              value={newRow[key] || ''}
                              onChange={(e) => handleInputChange(e, key)}
                            />
                          </td>
                        ))}
                        <td>
                          <button onClick={handleAddRow} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
                            Add Row
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow px-4 py-2 border rounded-md mr-2"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="New Table Name"
          />
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            onClick={handleAddTable}
          >
            Add Table
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;
