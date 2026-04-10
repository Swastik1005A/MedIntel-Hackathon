import { Pill, IndianRupee, TrendingUp, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Medicines Analyzed", value: "12,847", icon: Pill, change: "+234 this week" },
    { label: "Total Savings Generated", value: "₹4.2L", icon: IndianRupee, change: "Avg ₹87/search" },
    { label: "Average Savings", value: "62%", icon: TrendingUp, change: "Up from 58%" },
    { label: "Most Searched", value: "Crocin", icon: BarChart3, change: "Paracetamol category" },
  ];

  return (
    <section id="dashboard" className="py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Platform Insights</h2>
          <p className="text-muted-foreground text-sm">Aggregate impact data from MedIntel users</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card rounded-xl border p-6 hover-card-lift">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
