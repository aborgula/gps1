package com.example.zad1_gps;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnSuccessListener;

public class MainActivity extends AppCompatActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private Handler handler = new Handler();
    private Runnable locationUpdateRunnable;
    private FusedLocationProviderClient fusedLocationClient;
    private LatLng location1;
    private LatLng location2;
    private float lastAccuracy = -1;
    private boolean gps = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        Button plotButton = findViewById(R.id.plot_button);
        Button meButton = findViewById(R.id.gps_button);

        meButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                gps = true;
                updateLocation();
            }
        });
        plotButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                gps = false;
                plotPinFromInput();
            }
        });

        locationUpdateRunnable = new Runnable() {
            @Override
            public void run() {
                if (gps) {
                    updateLocation();
                    handler.postDelayed(this, 10000);
                }
            }
        };

    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;


        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    1001);

            return;
        }

        updateLocation();
        handler.postDelayed(locationUpdateRunnable, 10000);
    }

    private void updateLocation() {

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    1001);

            return;
        }


        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        if (location != null) {
                            double latitude = location.getLatitude();
                            double longitude = location.getLongitude();
                            float accuracy = location.getAccuracy();
                            System.out.println("accuracy: " + accuracy);

                            //symulacja ruchu
                            double randomLatChange = (Math.random() - 0.5) * 0.003;
                            double randomLngChange = (Math.random() - 0.5) * 0.003;
                            latitude += randomLatChange;
                            longitude += randomLngChange;

                            LatLng currentLocation = new LatLng(latitude, longitude);

                            if(location1 != null && location2 != null){
                                double averageLat = (location1.latitude+location2.latitude+currentLocation.latitude)/3;
                                double averageLng = (location1.longitude + location2.longitude+currentLocation.longitude)/3;

                                LatLng averageLocation = new LatLng(averageLat, averageLng);

                                mMap.clear();
                                mMap.addMarker(new MarkerOptions().position(averageLocation).title("You are here"));
                                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(averageLocation, 15));
                            }

                            location1 = location2;
                            location2 = currentLocation;


                            System.out.println("szerokosc: " + latitude);
                            System.out.println("dlugosc: " + longitude);

                        }
                    }
                });
    }

    private void plotPinFromInput(){
        EditText latitudeInput = findViewById(R.id.latitude_input);
        EditText longitudeInput = findViewById(R.id.longitude_input);

        try{
            double latitude = Double.parseDouble(latitudeInput.getText().toString());
            double longitude = Double.parseDouble(longitudeInput.getText().toString());

            LatLng pinLocation = new LatLng(latitude, longitude);
            mMap.clear();
            mMap.addMarker(new MarkerOptions().position(pinLocation).title("wybrana lokalizacja"));
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(pinLocation, 15));

        }catch(NumberFormatException e){
            Toast.makeText(this, "wprowadz prawidlowe dane", Toast.LENGTH_SHORT).show();
        }
    }

}
