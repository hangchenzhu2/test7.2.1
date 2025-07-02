import { useState } from 'react';

export default function Debug() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('测试中...');
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'test prompt',
          input_image: 'https://example.com/test.jpg'
        }),
      });
      
      const data = await response.json();
      
      setResult(`
状态码: ${response.status}
响应数据: ${JSON.stringify(data, null, 2)}
      `);
    } catch (error) {
      setResult(`错误: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API调试工具</h1>
      <button 
        onClick={testAPI} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '测试中...' : '测试API连接'}
      </button>
      
      <pre style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f4f4f4', 
        border: '1px solid #ddd',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap'
      }}>
        {result}
      </pre>
    </div>
  );
} 