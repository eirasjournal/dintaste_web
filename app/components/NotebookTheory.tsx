"use client";
import React from 'react';

export default function NotebookTheory() {
  return (
    <div className="notebook-page" style={{marginBottom: "10%"}}>

      <div className="sticky-note yellow">
        🎯 Key idea: <br />
        index + formula <br />
        = many possible positions
      </div>

      {/* SECTION 1 */}
      <h3 className="notebook-subtitle">
        1. Linear index <span className="highlight-text">i</span>
      </h3>

      <p className="notebook-paragraph">
        The robot runs inside a loop:
      </p>

      <pre className="notebook-code">
        FOR i = 0 TO N-1
      </pre>

      <p className="notebook-paragraph">
        where N is the total number of objects to place.
      </p>

      <p className="notebook-paragraph">
        The variable <strong>i</strong> represents the object number.
        The main question is: <br />
        <span className="highlight-text" style={{fontWeight: "bold", fontSize: "1.5em"}}> how do we convert i into a position (x, y, z)?</span>
      </p>

      {/* SECTION 2 */}
      <h3 className="notebook-subtitle">
        2. 2D pallet – rows and columns
      </h3>

      <p className="notebook-paragraph">
        We assume a pallet with:
      </p>

      <ul className="notebook-list">
        <li><strong>c</strong> = number of columns</li>
        <li><strong>r</strong> = number of rows</li>
        <li><strong>dx</strong> = spacing between objects on X axis</li>
        <li><strong>dy</strong> = spacing between objects on Y axis</li>
      </ul>
      <p className="notebook-paragraph">
        We need two mathematical operations to get column and row from index i:
      </p>
      <p className="notebook-paragraph">
        🔍 <strong>MOD (i / α)</strong> returns the remainder of the division <br />
        🔍 <strong>INT (i / α)</strong> returns the quotient of the division
      </p>

      <div>
  <p className="notebook-paragraph">
    Example for <strong>α = 3</strong>:
  </p>

        <div>
        {/* LINIA 1 */}
        <div className="explanation-row">
            <pre className="notebook-code">
            i: 0 1 2 3 4 5 6 7 8
            </pre>
            <div className="annotation-group">
            <svg width="50" height="20" viewBox="0 0 50 20" style={{ overflow: 'visible' }}>
                <defs>
                <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6" fill="#99c2ff" />
                </marker>
                </defs>
                <path d="M 0 10 L 40 10" stroke="#99c2ff" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
            </svg>
            <span className="handwritten-text">
                this is the index
            </span>
            </div>
        </div>

        {/* LINIA 2 */}
        <div className="explanation-row">
            <pre className="notebook-code">
            i MOD 3: 0 1 2 0 1 2 0 1 2
            </pre>
            <div className="annotation-group">
            <svg width="50" height="20" viewBox="0 0 50 20" style={{ overflow: 'visible' }}>
                <path d="M 0 10 L 40 10" stroke="#99c2ff" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
            </svg>
            <span className="handwritten-text">
                this operation will reset the expression from 3 to 3 values of i
            </span>
            </div>
        </div>
    </div>

  {/* LINIA 3 */}
  <div className="explanation-row">
    <pre className="notebook-code">
    INT(i/3): 0 0 0 1 1 1 2 2 2
    </pre>
    <div className="annotation-group">
      <svg width="50" height="20" viewBox="0 0 50 20" style={{ overflow: 'visible' }}>
        <path d="M 0 10 L 40 10" stroke="#99c2ff" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
      </svg>
      <span className="handwritten-text">
        this operation will increment the expression from 3 to 3 consecutive values of i
      </span>
    </div>
  </div>
</div>

      {/* SECTION 3 */}
      <h3 className="notebook-subtitle">
        3. 3D pallet – rows, columns and layers
      </h3>

      <p className="notebook-paragraph">
        For 3D palletizing we add:
      </p>

      <ul className="notebook-list">
        <li><strong>h</strong> = object height (spacing between objects on Z axis)</li>
        <li><strong>n</strong> = objects per layer</li>
      </ul>

      <pre className="notebook-code">
        layer number = INT( i / n ) 
      </pre>
      <p className="notebook-paragraph">
        The Z position is then calculated as:
      </p>
      <pre className="notebook-code">
        z = h × layer
      </pre>

      <p className="notebook-paragraph">
        This means:
        <span className="highlight-text">every n boxes, the robot moves up one layer</span>.
      </p>

      {/* CONCLUSION */}
      <h3 className="notebook-subtitle mt-12">
        Conclusion
      </h3>

      <p className="notebook-paragraph">
        Everything shown in the sketch reduces to:
      </p>

      <ul className="notebook-list">
        <li>a linear index <strong>i</strong></li>
        <li>simple operations: <strong>MOD (i / α) </strong> and <strong>INT (i / α) </strong></li>
      </ul>

      <span className="highlight-text" style={{fontWeight: "bold", fontSize: "1.5em", lineHeight: "1.4em"}}>
        This logic applies in industrial robotics to place objects in 2D and 3D pallets! 
      </span>

    </div>
  );
};