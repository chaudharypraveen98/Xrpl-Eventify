import React from "react";
import "../../styles/base/Table.css";

const CustomTable = ({ items, tableHeads, tableClickHandler }) => {
  return (
    <div className="tableBaseClass">
      <table className="table-fill">
        <thead>
          <tr>
            {tableHeads?.map((headItem, index) => (
              <th className="text-left" key={`head-${index}-headItem`}>
                {headItem}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-hover">
          {items?.map((Item, rowIndex) => (
            <tr className="text-left" key={`row-${rowIndex}`}>
              {tableHeads?.map((headItem, columnIndex) => {
                if (columnIndex === 0) {
                  return (
                    <td
                      className="text-left"
                      key={`data-${rowIndex}-${columnIndex}`}
                    >
                      <button
                        type="submit"
                        onClick={() => tableClickHandler(rowIndex, columnIndex)}
                      >
                        {Item[headItem] ? Item[headItem] : headItem}
                      </button>
                    </td>
                  );
                }
                // else if (columnIndex === 1) {
                //   return <td
                //     className="text-left"
                //     key={`data-${rowIndex}-${columnIndex}`}
                //   >
                //     <button
                //       type="submit"
                //       onClick={() => tableClickHandler(rowIndex, columnIndex)}
                //     >
                //       {Item[headItem] ? Item[headItem] : headItem}
                //     </button>
                //   </td>;
                // }
                return (
                  <td
                    className="text-left"
                    key={`data-${rowIndex}-${columnIndex}`}
                    onClick={() => tableClickHandler(rowIndex, columnIndex)}
                  >
                    {Item[headItem]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
