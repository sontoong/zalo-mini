import { divIcon, LatLngTuple } from "leaflet";
import React, { FC } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "zmp-ui";
import { renderToStaticMarkup } from "react-dom/server";

export const Map: FC<{ lat: number; long: number }> = ({ lat, long }) => {
  const position = [lat, long] as LatLngTuple;

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        icon={divIcon({
          html: renderToStaticMarkup(
            <Icon
              icon="zi-location"
              size={32}
              className="-translate-x-1/2 -translate-y-full"
            />,
          ),
          iconSize: [0, 0],
        })}
        position={position}
      >
        <Popup>
          lat: {position[0]}, long: {position[1]}
        </Popup>
      </Marker>
    </MapContainer>
  );
};
