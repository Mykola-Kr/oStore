package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    @NotNull
    private Long userId;
    @NotNull
    private Long addressId;
    @NotNull
    private Long deliveryId;
    private String comment;
    private Long orderStatusId;
    private Integer discount;
    @NotEmpty
    private List<ProductCountRequest> productsFororder;

}
