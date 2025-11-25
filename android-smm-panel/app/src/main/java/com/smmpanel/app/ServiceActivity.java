package com.smmpanel.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class ServiceActivity extends AppCompatActivity {
    
    private RecyclerView recyclerView;
    private ServiceAdapter adapter;
    private List<Service> serviceList;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_service);
        
        initViews();
        loadServices();
    }
    
    private void initViews() {
        recyclerView = findViewById(R.id.recycler_services);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        
        TextView tvTitle = findViewById(R.id.tv_title);
        tvTitle.setText("SMM Services");
        
        findViewById(R.id.btn_back).setOnClickListener(v -> finish());
    }
    
    private void loadServices() {
        serviceList = new ArrayList<>();
        
        // SMM Services
        serviceList.add(new Service(1, "Instagram Followers", "High quality Instagram followers dengan garansi 30 hari", "$2.50", 100, 10000, "instagram"));
        serviceList.add(new Service(2, "Facebook Page Likes", "Real Facebook page likes dari akun aktif", "$3.00", 100, 5000, "facebook"));
        serviceList.add(new Service(3, "YouTube Views", "Views YouTube organik dengan retensi tinggi", "$1.50", 1000, 100000, "youtube"));
        serviceList.add(new Service(4, "Twitter Followers", "Followers Twitter aktif dan real", "$4.00", 100, 5000, "twitter"));
        serviceList.add(new Service(5, "TikTok Likes", "Likes TikTok cepat dan aman", "$2.00", 100, 10000, "tiktok"));
        serviceList.add(new Service(6, "Instagram Likes", "Likes Instagram instant delivery", "$1.00", 100, 5000, "instagram"));
        serviceList.add(new Service(7, "YouTube Subscribers", "Subscriber YouTube dengan garansi", "$5.00", 100, 10000, "youtube"));
        serviceList.add(new Service(8, "TikTok Followers", "Followers TikTok berkualitas tinggi", "$3.50", 100, 10000, "tiktok"));
        
        adapter = new ServiceAdapter(serviceList);
        recyclerView.setAdapter(adapter);
    }
    
    // Service model class
    public static class Service {
        int id;
        String name;
        String description;
        String price;
        int minOrder;
        int maxOrder;
        String platform;
        
        Service(int id, String name, String description, String price, int minOrder, int maxOrder, String platform) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
            this.minOrder = minOrder;
            this.maxOrder = maxOrder;
            this.platform = platform;
        }
    }
    
    // Service adapter class
    public class ServiceAdapter extends RecyclerView.Adapter<ServiceAdapter.ViewHolder> {
        private List<Service> services;
        
        ServiceAdapter(List<Service> services) {
            this.services = services;
        }
        
        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_service, parent, false);
            return new ViewHolder(view);
        }
        
        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            Service service = services.get(position);
            holder.tvName.setText(service.name);
            holder.tvDescription.setText(service.description);
            holder.tvPrice.setText(service.price + " / 1000");
            holder.tvMinMax.setText("Min: " + service.minOrder + " | Max: " + String.format("%,d", service.maxOrder));
            
            holder.btnOrder.setOnClickListener(v -> {
                Toast.makeText(ServiceActivity.this, "Order " + service.name, Toast.LENGTH_SHORT).show();
            });
        }
        
        @Override
        public int getItemCount() {
            return services.size();
        }
        
        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvDescription, tvPrice, tvMinMax;
            Button btnOrder;
            
            ViewHolder(View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tv_name);
                tvDescription = itemView.findViewById(R.id.tv_description);
                tvPrice = itemView.findViewById(R.id.tv_price);
                tvMinMax = itemView.findViewById(R.id.tv_min_max);
                btnOrder = itemView.findViewById(R.id.btn_order);
            }
        }
    }
}
