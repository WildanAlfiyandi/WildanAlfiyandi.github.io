package com.smmpanel.app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class OrderActivity extends AppCompatActivity {
    
    private RecyclerView recyclerView;
    private OrderAdapter adapter;
    private List<Order> orderList;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order);
        
        initViews();
        loadOrders();
    }
    
    private void initViews() {
        recyclerView = findViewById(R.id.recycler_orders);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        
        TextView tvTitle = findViewById(R.id.tv_title);
        tvTitle.setText("Order Management");
        
        findViewById(R.id.btn_back).setOnClickListener(v -> finish());
    }
    
    private void loadOrders() {
        orderList = new ArrayList<>();
        
        // Sample orders
        orderList.add(new Order(1001, "Instagram Followers", "instagram.com/user1", 1000, "Completed", "$25.00"));
        orderList.add(new Order(1002, "Facebook Likes", "facebook.com/page1", 500, "Processing", "$15.00"));
        orderList.add(new Order(1003, "YouTube Views", "youtube.com/watch?v=abc", 5000, "Pending", "$50.00"));
        orderList.add(new Order(1004, "Twitter Followers", "twitter.com/user1", 2000, "Completed", "$40.00"));
        orderList.add(new Order(1005, "TikTok Likes", "tiktok.com/@user1/video/123", 3000, "Processing", "$30.00"));
        orderList.add(new Order(1006, "Instagram Likes", "instagram.com/p/abc123", 1500, "Completed", "$15.00"));
        orderList.add(new Order(1007, "Facebook Followers", "facebook.com/profile1", 800, "Cancelled", "$20.00"));
        orderList.add(new Order(1008, "YouTube Subscribers", "youtube.com/channel/abc", 200, "Pending", "$100.00"));
        orderList.add(new Order(1009, "Twitter Likes", "twitter.com/status/123", 1000, "Completed", "$10.00"));
        orderList.add(new Order(1010, "TikTok Followers", "tiktok.com/@user2", 5000, "Processing", "$75.00"));
        
        adapter = new OrderAdapter(orderList);
        recyclerView.setAdapter(adapter);
    }
    
    // Order model class
    public static class Order {
        int id;
        String service;
        String link;
        int quantity;
        String status;
        String amount;
        
        Order(int id, String service, String link, int quantity, String status, String amount) {
            this.id = id;
            this.service = service;
            this.link = link;
            this.quantity = quantity;
            this.status = status;
            this.amount = amount;
        }
    }
    
    // Order adapter class
    public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.ViewHolder> {
        private List<Order> orders;
        
        OrderAdapter(List<Order> orders) {
            this.orders = orders;
        }
        
        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_order, parent, false);
            return new ViewHolder(view);
        }
        
        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            Order order = orders.get(position);
            holder.tvOrderId.setText("#" + order.id);
            holder.tvService.setText(order.service);
            holder.tvLink.setText(order.link);
            holder.tvQuantity.setText(String.format("%,d", order.quantity));
            holder.tvStatus.setText(order.status);
            holder.tvAmount.setText(order.amount);
            
            // Set status color
            int color;
            switch (order.status) {
                case "Completed":
                    color = 0xFF10B981;
                    break;
                case "Processing":
                    color = 0xFF3B82F6;
                    break;
                case "Pending":
                    color = 0xFFF59E0B;
                    break;
                case "Cancelled":
                    color = 0xFFEF4444;
                    break;
                default:
                    color = 0xFF6B7280;
            }
            holder.tvStatus.setTextColor(color);
        }
        
        @Override
        public int getItemCount() {
            return orders.size();
        }
        
        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvOrderId, tvService, tvLink, tvQuantity, tvStatus, tvAmount;
            
            ViewHolder(View itemView) {
                super(itemView);
                tvOrderId = itemView.findViewById(R.id.tv_order_id);
                tvService = itemView.findViewById(R.id.tv_service);
                tvLink = itemView.findViewById(R.id.tv_link);
                tvQuantity = itemView.findViewById(R.id.tv_quantity);
                tvStatus = itemView.findViewById(R.id.tv_status);
                tvAmount = itemView.findViewById(R.id.tv_amount);
            }
        }
    }
}
