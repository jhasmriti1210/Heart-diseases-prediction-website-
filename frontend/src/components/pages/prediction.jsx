import React, { useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { jsPDF } from "jspdf";
import "./prediction.css";

function App() {
  const [formData, setFormData] = useState({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1,
    slope: 1,
    ca: 0,
    thal: 1,
  });

  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [voteCounts, setVoteCounts] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData
      );
      const { prediction, confidence, voteCounts } = response.data;
      console.log("Response:", response.data);
      setPrediction(prediction);
      setConfidence(confidence);
      setVoteCounts(voteCounts);
    } catch (error) {
      console.error("Error predicting heart disease risk:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Heart Disease Prediction Report", 20, 10);
    doc.text(
      `Prediction: ${prediction === 1 ? "Risk of Heart Disease" : "No Risk"}`,
      20,
      20
    );
    doc.text(`Confidence: ${confidence}%`, 20, 30);

    let yOffset = 40;
    doc.text("Input Features:", 20, yOffset);
    yOffset += 10;
    Object.keys(formData).forEach((key) => {
      doc.text(`${key}: ${formData[key]}`, 20, yOffset);
      yOffset += 10;
    });

    doc.save("heart_disease_report.pdf");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">PulseIQ</div>
        <ul className="nav-links">
          <li>
            <a href="/">← Go to Home</a>
          </li>
        </ul>
      </nav>

      <div className="App">
        <div className="input-form">
          <h1 className="head">Fill the Details Below:</h1>

          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </label>

          <label>
            Sex:
            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value={1}>Male</option>
              <option value={0}>Female</option>
            </select>
          </label>

          <label>
            Chest Pain Type:
            <select name="cp" value={formData.cp} onChange={handleChange}>
              <option value={0}>Typical Angina</option>
              <option value={1}>Atypical Angina</option>
              <option value={2}>Non-anginal Pain</option>
              <option value={3}>Asymptomatic</option>
            </select>
          </label>

          <label>
            Resting Blood Pressure:
            <input
              type="number"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleChange}
            />
          </label>

          <label>
            Serum Cholesterol:
            <input
              type="number"
              name="chol"
              value={formData.chol}
              onChange={handleChange}
            />
          </label>

          <label>
            Fasting Blood Sugar &gt; 120 mg/dl:
            <select name="fbs" value={formData.fbs} onChange={handleChange}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </label>

          <label>
            ECG Results:
            <select
              name="restecg"
              value={formData.restecg}
              onChange={handleChange}
            >
              <option value={0}>Normal</option>
              <option value={1}>ST-T Wave Abnormality</option>
              <option value={2}>Left Ventricular Hypertrophy</option>
            </select>
          </label>

          <label>
            Maximum Heart Rate:
            <input
              type="number"
              name="thalach"
              value={formData.thalach}
              onChange={handleChange}
            />
          </label>

          <label>
            Exercise Induced Angina:
            <select name="exang" value={formData.exang} onChange={handleChange}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </label>

          <label>
            ST Depression (oldpeak):
            <input
              type="number"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleChange}
            />
          </label>

          <label>
            Slope of ST Segment:
            <select name="slope" value={formData.slope} onChange={handleChange}>
              <option value={1}>Upsloping</option>
              <option value={2}>Flat</option>
              <option value={3}>Downsloping</option>
            </select>
          </label>

          <label>
            Major Vessels Colored (ca):
            <input
              type="number"
              name="ca"
              value={formData.ca}
              onChange={handleChange}
            />
          </label>

          <label>
            Thalassemia:
            <select name="thal" value={formData.thal} onChange={handleChange}>
              <option value={1}>Normal</option>
              <option value={2}>Fixed Defect</option>
              <option value={3}>Reversible Defect</option>
            </select>
          </label>

          <button onClick={handlePredict}>Predict</button>
        </div>

        {prediction !== null && (
          <div className="results">
            <h2>Prediction Result</h2>
            <p className={`res ${prediction === 1 ? "danger" : "safe"}`}>
              {prediction === 1 ? "Heart Disease Risk Detected!" : "No Risk"}
            </p>
            <p>Confidence: {confidence}%</p>

            <h3>Gauge Chart</h3>
            <Chart
              chartType="Gauge"
              data={[
                ["Label", "Value"],
                ["Confidence", confidence],
              ]}
              options={{
                redFrom: 50,
                redTo: 100,
                yellowFrom: 25,
                yellowTo: 50,
                greenFrom: 0,
                greenTo: 25,
                minorTicks: 5,
              }}
              width="400px"
              height="200px"
            />

            <h3>Feature Overview</h3>
            <Chart
              chartType="BarChart"
              data={[
                ["Feature", "Value"],
                ["Age", formData.age],
                ["Chest Pain", formData.cp],
                ["Max HR", formData.thalach],
                ["Cholesterol", formData.chol],
                ["Oldpeak", formData.oldpeak],
              ]}
              width="400px"
              height="200px"
            />

            {voteCounts && (
              <>
                <h3>Voting Classifier Results</h3>
                <Chart
                  chartType="PieChart"
                  data={[
                    ["Class", "Votes"],
                    ["No Risk", voteCounts["0"] || 0],
                    ["Risk", voteCounts["1"] || 0],
                  ]}
                  width={"400px"}
                  height={"300px"}
                  options={{
                    is3D: true,
                    slices: {
                      0: { color: "#4CAF50" },
                      1: { color: "#F44336" },
                    },
                  }}
                />
              </>
            )}

            <button onClick={generatePDF}>Download PDF Report</button>
          </div>
        )}
      </div>

      <div className="description-section">
        <div className="dataset-description">
          <h2>Dataset Description</h2>
          <ul>
            <li>
              <strong>cp</strong>: Chest pain type (0–3)
            </li>
            <li>
              <strong>trestbps</strong>: Resting blood pressure
            </li>
            <li>
              <strong>chol</strong>: Serum cholesterol
            </li>
            <li>
              <strong>fbs</strong>: Fasting blood sugar &gt; 120 mg/dl
            </li>
            <li>
              <strong>restecg</strong>: ECG results (0–2)
            </li>
            <li>
              <strong>thalach</strong>: Max heart rate
            </li>
            <li>
              <strong>exang</strong>: Exercise-induced angina
            </li>
            <li>
              <strong>oldpeak</strong>: ST depression
            </li>
            <li>
              <strong>slope</strong>: ST slope (1 = up, 2 = flat, 3 = down)
            </li>
            <li>
              <strong>ca</strong>: Major vessels (0–4)
            </li>
            <li>
              <strong>thal</strong>: Thalassemia result (1–3)
            </li>
          </ul>
        </div>
        <img
          src="/dataset.png"
          alt="Dataset Description"
          className="dataset-image"
        />
      </div>
    </div>
  );
}

export default App;
