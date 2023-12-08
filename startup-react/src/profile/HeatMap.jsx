import React from 'react';
import { useEffect } from 'react';

export function HeatMap() {

    useEffect(() => {
        initMap();
    }, []);

    let map;

    async function initMap() {
        const center = { lat: 40.25191879272461, lng: -111.64933776855469 };

        const { Map } = await google.maps.importLibrary("maps");


        const mapOptions = {
            zoom: 14,
            center: center,
            mapId: "HEAT_MAP",
            mapTypeId: google.maps.MapTypeId.HYBRID,
        };

        // Create the map
        map = new Map(document.getElementById("map"), mapOptions);

        // get the list of markers from the api
        const username = localStorage.getItem("user");
        fetch(`/api/markers/${username}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.markers.forEach(markerInfo => {
                    addMarker(markerInfo.position);
                });
            })
            .catch(error => {
                console.error("Error fetching markers:", error);
            })
    }

    function addMarker(location) {
        new google.maps.Marker({
            position: location,
            map: map
        });
    }


    return (
        <>
            <script>
                {(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
                    key: "AIzaSyC0WvYAj2s30V8ibR3oBqFM9Ws2XYiViKQ",
                    v: "weekly",
                })}
            </script>

            <div id="map"></div>
        </>

    )
}