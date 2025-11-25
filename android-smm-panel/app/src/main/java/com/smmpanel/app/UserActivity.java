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

public class UserActivity extends AppCompatActivity {
    
    private RecyclerView recyclerView;
    private UserAdapter adapter;
    private List<User> userList;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);
        
        initViews();
        loadUsers();
    }
    
    private void initViews() {
        recyclerView = findViewById(R.id.recycler_users);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        
        TextView tvTitle = findViewById(R.id.tv_title);
        tvTitle.setText("User Management");
        
        findViewById(R.id.btn_back).setOnClickListener(v -> finish());
    }
    
    private void loadUsers() {
        userList = new ArrayList<>();
        
        // Sample users
        userList.add(new User(1, "John Doe", "john@example.com", "$150.00", 25, "Active"));
        userList.add(new User(2, "Jane Smith", "jane@example.com", "$320.50", 42, "Active"));
        userList.add(new User(3, "Bob Johnson", "bob@example.com", "$75.25", 15, "Active"));
        userList.add(new User(4, "Alice Brown", "alice@example.com", "$500.00", 68, "Active"));
        userList.add(new User(5, "Charlie Wilson", "charlie@example.com", "$0.00", 5, "Inactive"));
        userList.add(new User(6, "Diana Lee", "diana@example.com", "$1,250.00", 120, "Active"));
        userList.add(new User(7, "Edward Kim", "edward@example.com", "$89.75", 18, "Active"));
        userList.add(new User(8, "Fiona Garcia", "fiona@example.com", "$45.00", 8, "Inactive"));
        userList.add(new User(9, "George Martinez", "george@example.com", "$780.25", 95, "Active"));
        userList.add(new User(10, "Helen Taylor", "helen@example.com", "$210.00", 32, "Active"));
        
        adapter = new UserAdapter(userList);
        recyclerView.setAdapter(adapter);
    }
    
    // User model class
    public static class User {
        int id;
        String name;
        String email;
        String balance;
        int orders;
        String status;
        
        User(int id, String name, String email, String balance, int orders, String status) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.balance = balance;
            this.orders = orders;
            this.status = status;
        }
    }
    
    // User adapter class
    public class UserAdapter extends RecyclerView.Adapter<UserAdapter.ViewHolder> {
        private List<User> users;
        
        UserAdapter(List<User> users) {
            this.users = users;
        }
        
        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_user, parent, false);
            return new ViewHolder(view);
        }
        
        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            User user = users.get(position);
            holder.tvName.setText(user.name);
            holder.tvEmail.setText(user.email);
            holder.tvBalance.setText(user.balance);
            holder.tvOrders.setText(user.orders + " orders");
            holder.tvStatus.setText(user.status);
            
            // Set status color
            int color = user.status.equals("Active") ? 0xFF10B981 : 0xFFEF4444;
            holder.tvStatus.setTextColor(color);
        }
        
        @Override
        public int getItemCount() {
            return users.size();
        }
        
        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvEmail, tvBalance, tvOrders, tvStatus;
            
            ViewHolder(View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tv_name);
                tvEmail = itemView.findViewById(R.id.tv_email);
                tvBalance = itemView.findViewById(R.id.tv_balance);
                tvOrders = itemView.findViewById(R.id.tv_orders);
                tvStatus = itemView.findViewById(R.id.tv_status);
            }
        }
    }
}
