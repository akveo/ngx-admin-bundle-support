/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.DataAccess.EFCore.Configuration.System;
using IoT.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IoT.DataAccess.EFCore
{
    public class ContactConfig : BaseEntityConfig<Contact>
    {
        public ContactConfig() : base("Contacts")
        { }

        public override void Configure(EntityTypeBuilder<Contact> builder)
        {
            base.Configure(builder);

            builder.Property(obj => obj.FirstName).IsRequired();
            builder.Property(obj => obj.LastName).IsRequired();
            builder.Property(obj => obj.PhoneNumber).IsRequired();
            builder.Property(obj => obj.NumberType).IsRequired();

            builder.HasOne(obj => obj.Photo)
                .WithOne(obj => obj.Contact)
                .HasForeignKey<ContactPhoto>(obj => obj.Id)
                .OnDelete(Microsoft.EntityFrameworkCore.DeleteBehavior.Cascade);
        }
    }
}
