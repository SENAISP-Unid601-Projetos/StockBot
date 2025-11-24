package com.example.Back.Controller;

import com.example.Back.Dto.DashboardDataDTO;
import com.example.Back.Service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()") // Todo funcionário pode ver o dashboard da empresa
    public ResponseEntity<DashboardDataDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}