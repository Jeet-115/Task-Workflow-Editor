import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function TaskNode({ data, id }) {
  return (
    <div style={{
      padding: 10,
      border: '2px solid #2ecc71',
      borderRadius: 8,
      background: '#ecf0f1',
      minWidth: 180,
    }}>
      <strong>📝 Task:</strong>
      <input
        type="text"
        value={data.label}
        onChange={(e) => data.onChange(id, 'label', e.target.value)}
        style={{
          width: '100%',
          marginTop: 5,
          padding: 5,
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />

      <div style={{ marginTop: 8 }}>
        <strong>Status:</strong>
        <select
          value={data.status}
          onChange={(e) => data.onChange(id, 'status', e.target.value)}
          style={{
            width: '100%',
            marginTop: 5,
            padding: 5,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
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
