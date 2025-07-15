HEADERS_ALIASES = {
    "order_date": ["Order Date", "Date", "Invoice Date"],
    "order_id": ["Order Number", "Order ID", "Invoice No"],
    "product_sku": ["SKU", "Product SKU", "Item Code"],
    "product_name": ["Product Name", "Item Name"],
    "quantity": ["Quantity", "Qty"],
    "product_category": ["Product Category", "Category"],
    "destination_country": ["Country", "Destination Country", "Customer Country"],
    "vat_rate": ["VAT Rate", "Tax Rate", "GST Rate"],
    "net_price": ["Net Price", "Base Price", "Amount"],
    "product_vat_amount": ["Product VAT", "VAT Amount", "Tax"],
    "shipping_amount": ["Shipping Amount", "SP Amount", "Shipping Amt"],
    "total_vat_amount": ["Total VAT", "Total Tax", "Total Vat"],
    "gross_total_amount": ["Final Gross Total", "Total Amount", "Invoice Total"]
}


def resolve_headers(input_headers: list[str], aliases: dict[str, list[str]]) -> dict[str, str]:
    # Initialize an empty dictionary to store the final mapping
    mapping = {}

    # Convert all input headers to lowercase and strip spaces for case-insensitive matching
    lower_input = [h.lower().strip() for h in input_headers]

    # Loop through each internal field and its list of possible aliases
    for internal_field, possible_aliases in aliases.items():
        for alias in possible_aliases:
            # Normalize the alias for comparison
            normalized_alias = alias.lower().strip()
            # Check if the normalized alias is present in the normalized input headers
            if normalized_alias in lower_input:
                # If found, get the original (actual) header name from input_headers
                matched_input = input_headers[lower_input.index(normalized_alias)]
                # Map the original input header to the internal standardized field name
                mapping[matched_input] = internal_field
                break  # Stop checking aliases once a match is found for this field

    # Return the final header mapping dictionary
    return mapping
