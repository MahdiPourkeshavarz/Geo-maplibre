/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { Map, Source, Layer, NavigationControl } from "@vis.gl/react-maplibre";
import type { CircleLayer, MapGeoJSONFeature } from "@vis.gl/react-maplibre";
import type { FeatureCollection } from "geojson";
import { DrawControl } from "./DrawControl";

import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "../style/CustomTools.css";

const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.4, 37.8] },
      properties: null,
    },
  ],
};

const layerStyle: CircleLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
  source: "",
};

interface Viewport {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface DrawEvent {
  features: MapGeoJSONFeature[];
}

const MapContainer: React.FC = () => {
  const [viewport, setViewport] = useState<Viewport>({
    longitude: 0,
    latitude: 0,
    zoom: 2,
  });

  const [features, setFeatures] = useState<MapGeoJSONFeature[]>([]);

  const onUpdate = useCallback((e: DrawEvent) => {
    setFeatures((currentFeatures) => {
      const newFeatures = [...currentFeatures];
      for (const feature of e.features) {
        const index = currentFeatures.findIndex((f) => f.id === feature.id);
        if (index !== -1) {
          newFeatures[index] = feature;
        }
      }
      return newFeatures;
    });
  }, []);

  const onCreate = useCallback((e: DrawEvent) => {
    setFeatures((currentFeatures) => [...currentFeatures, ...e.features]);
  }, []);

  const onDelete = useCallback((e: DrawEvent) => {
    setFeatures((currentFeatures) =>
      currentFeatures.filter((f) => !e.features.find((ef) => ef.id === f.id))
    );
  }, []);

  return (
    <>
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100%" }}
        mapStyle={{
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [
                `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=oIbPNoVyRAI8elX01bxB`,
              ],
              tileSize: 256,
              attribution: "© MapTiler © OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "satellite-layer",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        }}
      >
        <NavigationControl position="top-left" />
        <DrawControl
          position="top-right"
          displayControlsDefault={true}
          controls={{
            point: true,
            line_string: true,
            polygon: true,
            trash: true,
            combine_features: true,
            uncombine_features: true,
          }}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </>
  );
};

export default MapContainer;
