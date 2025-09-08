package com.example.Invoice_Hrms.service;

import com.example.Invoice_Hrms.dto.ItemMasterDto;
import com.example.Invoice_Hrms.model.ItemMaster;
import com.example.Invoice_Hrms.repository.ItemMasterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class ItemMasterService {

    private  final ItemMasterRepository repository;


    public ItemMasterService(ItemMasterRepository repository) {
        this.repository = repository;
    }
    public List<ItemMasterDto> getAllItems() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ItemMasterDto getItemById(String id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    public ItemMasterDto createItem(ItemMasterDto dto) {
        ItemMaster item = toEntity(dto);
        return toDto(repository.save(item));
    }

    public ItemMasterDto updateItem(String id, ItemMasterDto dto) {
        Optional<ItemMaster> optional = repository.findById(id);
        if (optional.isPresent()) {
            ItemMaster item = optional.get();
            item.setItemName(dto.getItemName());
            item.setDescription(dto.getDescription());
            return toDto(repository.save(item));
        }
        return null;
    }

    public void deleteItem(String id) {
        repository.deleteById(id);
    }

    private ItemMasterDto toDto(ItemMaster item) {
        ItemMasterDto dto = new ItemMasterDto();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());
        return dto;
    }

    private ItemMaster toEntity(ItemMasterDto dto) {
        ItemMaster item = new ItemMaster();
        item.setId(dto.getId());
        item.setItemName(dto.getItemName());
        item.setDescription(dto.getDescription());
        return item;
    }
}
