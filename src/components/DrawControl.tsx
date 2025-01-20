import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "@vis.gl/react-maplibre";
import type { ControlPosition } from "@vis.gl/react-maplibre";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
type DrawControlProps = {
  position?: ControlPosition;
  displayControlsDefault?: boolean;
  controls?: {
    point?: boolean;
    line_string?: boolean;
    polygon?: boolean;
    trash?: boolean;
    combine_features: boolean;
    uncombine_features: boolean;
  };
  onCreate?: (e: any) => void;
  onUpdate?: (e: any) => void;
  onDelete?: (e: any) => void;
};

export const DrawControl: React.FC<DrawControlProps> = (props) => {
  useControl(
    () =>
      new MapboxDraw({
        displayControlsDefault: props.displayControlsDefault ?? true,
        controls: {
          point: props.controls?.point ?? true,
          line_string: props.controls?.line_string ?? true,
          polygon: props.controls?.polygon ?? true,
          trash: props.controls?.trash ?? true,
          combine_features: props.controls?.combine_features ?? true,
          uncombine_features: props.controls?.uncombine_features ?? true,
        },
      }),
    {
      position: props.position,
    }
  );

  useControl(
    ({ map }) => {
      map.on("draw.create", props.onCreate);
      map.on("draw.update", props.onUpdate);
      map.on("draw.delete", props.onDelete);
      return undefined;
    },
    { position: props.position }
  );

  return null;
};
