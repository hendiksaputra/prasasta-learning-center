<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->json('course_materials')->nullable()->after('what_you_will_learn');
            $table->json('requirements')->nullable()->after('course_materials');
            $table->json('facilities')->nullable()->after('requirements');
            $table->text('internship_opportunity')->nullable()->after('facilities');
            $table->text('certification_info')->nullable()->after('internship_opportunity');
            $table->decimal('certification_price', 10, 2)->nullable()->after('certification_info');
            $table->string('registration_link')->nullable()->after('certification_price');
            $table->date('registration_deadline')->nullable()->after('registration_link');
            $table->boolean('limited_quota')->default(false)->after('registration_deadline');
            $table->text('training_method')->nullable()->after('limited_quota');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn([
                'course_materials',
                'requirements',
                'facilities',
                'internship_opportunity',
                'certification_info',
                'certification_price',
                'registration_link',
                'registration_deadline',
                'limited_quota',
                'training_method',
            ]);
        });
    }
};

