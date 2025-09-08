package com.example.Invoice_Hrms.controller;

import com.example.Invoice_Hrms.dto.ItemMasterDto;
import com.example.Invoice_Hrms.service.ItemMasterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/itemMaster")
public class ItemMasterController {


    private final ItemMasterService service;
    public ItemMasterController(ItemMasterService service) {
        this.service = service;
    }

    @GetMapping
    public List<ItemMasterDto> getAllItems() {
        return service.getAllItems();
    }

    @GetMapping("/{id}")
    public ItemMasterDto getItemById(@PathVariable String id) {
        return service.getItemById(id);
    }

    @PostMapping
    public ItemMasterDto createItem(@RequestBody ItemMasterDto dto) {
        return service.createItem(dto);
    }

    @PutMapping("/{id}")
    public ItemMasterDto updateItem(@PathVariable String id, @RequestBody ItemMasterDto dto) {
        return service.updateItem(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable String id) {
        service.deleteItem(id);
    }

}


