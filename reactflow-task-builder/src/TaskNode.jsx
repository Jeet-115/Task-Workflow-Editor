import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function TaskNode({ data, id }) {
  return (
    <div className="p-4 min-w-[180px] bg-white border-2 border-green-500 rounded-lg shadow-md">
      <label className="block text-sm font-semibold text-gray-700 mb-1">📝 Task:</label>
      <input
        type="text"
        value={data.label}
        onChange={(e) => data.onChange(id, 'label', e.target.value)}
        className="nodrag nowheel w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Status:</label>
        <select
          value={data.status}
          onChange={(e) => data.onChange(id, 'status', e.target.value)}
          className="nodrag nowheel w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(TaskNode);
