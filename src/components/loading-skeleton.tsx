import { FunctionalComponent } from 'preact';

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const LoadingSkeleton: FunctionalComponent = () => {
  return (
    <div className="skeleton-results">
      <div className="table-preview" style={{ opacity: 0.5 }}>
        <div className="table-header">
          <caption
            className="title skeleton"
            style={{ background: 'var(--light-grey)', width: 150, height: 14 }}
          />
          <div className="pill skeleton" style={{ height: 20, width: 60 }}></div>
        </div>
        <div className="table-body">
          <div className="table-container">
            <table>
              {new Array(5).fill(0).map((_, index) => (
                <tr key={index}>
                  <td>
                    <div
                      className="skeleton"
                      style={{
                        background: 'var(--light-grey)',
                        width: randomNumber(30, 80),
                        height: 14,
                      }}
                    />
                  </td>
                  <td>
                    <div
                      className="skeleton"
                      style={{
                        background: 'var(--light-grey)',
                        width: randomNumber(30, 80),
                        height: 14,
                      }}
                    />
                  </td>
                  <td>
                    <div
                      className="skeleton"
                      style={{
                        background: 'var(--light-grey)',
                        width: randomNumber(30, 80),
                        height: 14,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </table>
            <div className="shade" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
