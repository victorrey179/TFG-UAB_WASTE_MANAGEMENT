import React from "react";
import ReactSlider from "react-slider";
import { useServerContext } from "../../contexts/ServerContext";

const marks = [
  { label: "1min" },
  { label: "5min" },
  { label: "10min" },
  { label: "30min" },
  { label: "1h" },
  { label: "2h" },
  { label: "6h" },
  { label: "12h" },
  { label: "1d" },
  { label: "2d" },
  { label: "5d" },
  { label: "1sem" },
  { label: "2sem" },
  { label: "3sem" },
  { label: "1mes" },
];

const MeasurementConfiguration: React.FC = () => {
  const { sliderValue, setSliderValue } = useServerContext();

  const renderThumb = (props: any, state: any) => (
    <div {...props}>
      <div
        style={{
          position: "absolute",
          top: "-25px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "15px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {marks[sliderValue].label}
      </div>
      <div className="thumb" />
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-bold mb-2">
        Escala de representación de lecturas
      </h2>
      <div className="flex flex-col p-3 items-center justify-center w-full">
        <style>
          {`
          .horizontal-slider {
            width: 100%;
            height: 5px;
          }

          .thumb {
            width: 7px;
            height: 15px;
            background-color: #394c9a;
            cursor: grab;
            border-radius: 40%;
            border: none;
            outline: none;
          }

          .track {
            top: 0;
            bottom: 0;
            background: #fff;
            border-radius: 999px;
          }
        `}
        </style>
        <ReactSlider
          min={0}
          max={14}
          value={sliderValue}
          onChange={(value: number | number[]) => {
            if (typeof value === "number") {
              setSliderValue(value);
            }
          }}
          renderThumb={renderThumb}
          className="horizontal-slider"
          thumbClassName="thumb"
          trackClassName="track"
        />
      </div>
    </div>
  );
};

export default MeasurementConfiguration;
