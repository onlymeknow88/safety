<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Ambil statistik dari database
        // Contoh dengan Eloquent:
        // $stats = [
        //     'revenue'    => Order::whereMonth('created_at', now()->month)->sum('total'),
        //     'orders'     => Order::count(),
        //     'users'      => User::count(),
        //     'growth'     => 24.8,
        // ];
        //
        // $recentOrders = Order::with('user', 'product')
        //     ->latest()
        //     ->limit(10)
        //     ->get();

        return Inertia::render('Dashboard/Index', [
            // 'stats'        => $stats,
            // 'recentOrders' => $recentOrders,
        ]);
    }
}
